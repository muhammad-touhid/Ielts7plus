// src/lib/pageBuilder/fields/withLabel.js
"use client";

// For Puck custom fields (type: "custom"), Puck does NOT automatically
// show the field's label above your render output — unlike built-in
// field types (select/radio/text), which handle this internally. Instead
// Puck passes `Label` (a component) and `label` (the text) as props into
// your render function, and it's on you to use them.
//
// Wrap any custom field's render function with this so it displays a
// label exactly like the built-in field types do.
export function withLabel(renderFn) {
  return function LabeledField(props) {
    const { Label: LabelComponent, label } = props;
    return <LabelComponent label={label}>{renderFn(props)}</LabelComponent>;
  };
}
