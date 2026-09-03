import prisma from "@/lib/prisma";
import FormLabelFilter from "./FormLabelFilter";
import SearchBar from "./SearchBar";
import SubmissionDetailsModal from "./SubmissionDetailsModal";
import DeleteSubmissionButton from "./DeleteSubmissionButton";

export const dynamic = "force-dynamic";

// Field keys are stored as slugified-label + index (e.g. "full-name-0")
// by the Form widget. This strips the trailing index so we can match
// on the semantic part of the key regardless of which position that
// field happened to be in on a given form.
function cleanKey(key) {
  return key.replace(/-\d+$/, "");
}

// Since every Form widget can define completely different fields,
// there's no fixed "name" or "message" column in the DB — we find the
// best-matching field by keyword instead. This only affects what's
// shown in the table preview; the raw data (and the View All modal)
// always shows everything exactly as submitted.
function findByKeyword(data, keywords) {
  for (const [key, value] of Object.entries(data || {})) {
    const clean = cleanKey(key);
    if (keywords.some((kw) => clean.includes(kw))) return value;
  }
  return null;
}

function truncateWords(text, maxWords = 9) {
  const str = String(text ?? "").trim();
  if (!str) return "";
  const words = str.split(/\s+/);
  if (words.length <= maxWords) return str;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

export default async function AdminFormSubmissionsPage({ searchParams }) {
  const { formLabel, q } = await searchParams;

  const labelRows = await prisma.formSubmission.findMany({
    select: { formLabel: true },
    distinct: ["formLabel"],
    orderBy: { formLabel: "asc" },
  });
  const labels = labelRows.map((r) => r.formLabel).filter(Boolean);

  const where = !formLabel
    ? {}
    : formLabel === "__none__"
      ? { formLabel: null }
      : { formLabel };

  let submissions = await prisma.formSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Search runs across every submitted field value (not just
  // name/phone/email specifically) since field keys vary per form —
  // this naturally covers name, phone, and email as long as those are
  // fields on the form, without needing to know each form's exact
  // field set ahead of time.
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    submissions = submissions.filter((sub) =>
      Object.values(sub.data || {}).some((v) =>
        String(v).toLowerCase().includes(needle),
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">
          Form Submissions
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Responses from every Form widget across the site.
        </p>
      </div>

      {/* Filter + Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchBar />
        <FormLabelFilter labels={labels} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Form / Page
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Submitted Data
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => {
                  const name = findByKeyword(sub.data, ["name"]);
                  const message = findByKeyword(sub.data, [
                    "message",
                    "note",
                    "comment",
                    "details",
                    "query",
                  ]);
                  const preview = truncateWords(message, 9);

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {name || <span className="text-slate-300">—</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {sub.formLabel ? (
                          <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-1.5">
                            {sub.formLabel}
                          </span>
                        ) : (
                          <span className="inline-block text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full mb-1.5">
                            No label
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-[280px]">
                        <div className="flex items-center gap-3">
                          {preview ? (
                            <p className="text-slate-500 text-xs">{preview}</p>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                          <SubmissionDetailsModal submission={sub} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <DeleteSubmissionButton id={sub.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-forms" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No submissions found
            </p>
            <p className="text-xs text-slate-400">
              {q || formLabel
                ? "Try clearing your search or filter."
                : "Responses from any Form widget will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
