// src/lib/pageBuilder/cards/TeamCard.jsx
"use client";

export function TeamCard({ item: member }) {
  return (
    <div
      className="rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-4 h-full"
      style={{
        background: "var(--card-bg, #ffffff)",
        padding: "var(--card-padding, 24px)",
      }}
    >
      <img
        src={member.image || "/images/avatar-placeholder.png"}
        alt={member.name}
        className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
      />
      <div>
        <h3
          className="font-bold text-gray-700 mb-1"
          style={{ fontSize: "var(--card-title-size, 0.875rem)" }}
        >
          {member.name}
        </h3>
        {member.publicTitle && (
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
            {member.publicTitle}
          </span>
        )}
        {member.bio && (
          <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
        )}
      </div>
      {(member.linkedinUrl || member.facebookUrl) && (
        <>
          <div className="w-full h-px bg-slate-100" />
          <div className="flex items-center gap-3">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                <i className="ti ti-brand-linkedin text-sm" />
              </a>
            )}
            {member.facebookUrl && (
              <a
                href={member.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                <i className="ti ti-brand-facebook text-sm" />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
