"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Arrow } from "./brand";

type Interest = { value: string; label: string };

type FormCopy = {
  interests: Interest[];
  headingEyebrow: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  companyLabel: string;
  companyOptional: string;
  companyPlaceholder: string;
  interestLegend: string;
  problemLabel: string;
  problemPlaceholder: string;
  formHelp: string;
  submit: string;
  disclosure: string;
  validationName: string;
  validationProblem: string;
  briefGreeting: string;
  briefInterested: string;
  briefName: string;
  briefEmail: string;
  briefCompany: string;
  briefCompanyNone: string;
  emailSubject: string;
  resultH2: string;
  resultP: string;
  ariaDraft: string;
  openEmail: string;
  copy: string;
  copied: string;
  copyError: string;
  resultDisclosure: string;
};

export function ContactForm({ form }: { form: FormCopy }) {
  const interests = form.interests;
  const params = useSearchParams();
  const [selected, setSelected] = useState(
    interests.some((item) => item.value === params.get("type"))
      ? params.get("type")!
      : "not-sure",
  );
  const [brief, setBrief] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [emailUrl, setEmailUrl] = useState("");
  const resultRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (brief) resultRef.current?.focus();
  }, [brief]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const problem = String(data.get("problem")).trim();
    for (const [field, message] of [
      ["name", form.validationName],
      ["problem", form.validationProblem],
    ]) {
      const control = event.currentTarget.elements.namedItem(field) as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (control.value.trim().length < (field === "problem" ? 10 : 1)) {
        control.setCustomValidity(message);
        control.reportValidity();
        return;
      }
    }
    const text = `${form.briefGreeting}\n\n${problem}\n\n${form.briefInterested} ${interests.find((item) => item.value === selected)?.label}\n${form.briefName} ${name}\n${form.briefEmail} ${email}\n${form.briefCompany} ${String(data.get("company")).trim() || form.briefCompanyNone}\n`;
    setBrief(text);
    setEmailUrl(
      `mailto:hello@quackbytes.com?subject=${encodeURIComponent(`${form.emailSubject} ${name}`)}&body=${encodeURIComponent(text)}`,
    );
    setCopied(false);
    setCopyError(false);
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="contact-form">
      <div className="form-heading">
        <span className="eyebrow">{form.headingEyebrow}</span>
        <span className="form-index">↘</span>
      </div>
      <form
        onSubmit={prepare}
        onInput={(event) => {
          const control = event.target;
          if (
            control instanceof HTMLInputElement ||
            control instanceof HTMLTextAreaElement
          )
            control.setCustomValidity("");
        }}
        onChange={() => {
          if (brief) setBrief("");
        }}
      >
        <div className="form-row">
          <label>
            {form.nameLabel} <span>*</span>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder={form.namePlaceholder}
            />
          </label>
          <label>
            {form.emailLabel} <span>*</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              placeholder={form.emailPlaceholder}
            />
          </label>
        </div>
        <label>
          {form.companyLabel}{" "}
          <span className="optional">{form.companyOptional}</span>
          <input
            name="company"
            autoComplete="organization"
            maxLength={150}
            placeholder={form.companyPlaceholder}
          />
        </label>
        <fieldset>
          <legend>{form.interestLegend}</legend>
          <div className="interest-options">
            {interests.map((item) => (
              <label
                className={`interest ${selected === item.value ? "selected" : ""}`}
                key={item.value}
              >
                <input
                  type="radio"
                  name="interest"
                  value={item.value}
                  checked={selected === item.value}
                  onChange={() => setSelected(item.value)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label>
          {form.problemLabel} <span>*</span>
          <textarea
            name="problem"
            required
            minLength={10}
            maxLength={3000}
            rows={5}
            placeholder={form.problemPlaceholder}
          />
        </label>
        <p className="form-help">{form.formHelp}</p>
        <button className="button button-dark form-submit" type="submit">
          {form.submit} <Arrow diagonal />
        </button>
        <p className="form-disclosure">{form.disclosure}</p>
      </form>
      {brief && (
        <section
          ref={resultRef}
          tabIndex={-1}
          className="brief-result"
          aria-label={form.ariaDraft}
          aria-live="polite"
        >
          <h2>{form.resultH2}</h2>
          <p>{form.resultP}</p>
          <pre>{brief}</pre>
          <div className="brief-actions">
            <a className="button button-orange" href={emailUrl}>
              {form.openEmail} <Arrow diagonal />
            </a>
            <button className="text-link" onClick={copyBrief} type="button">
              {copied ? form.copied : form.copy}
            </button>
          </div>
          {copyError && <p>{form.copyError}</p>}
          <p className="form-disclosure">{form.resultDisclosure}</p>
        </section>
      )}
    </div>
  );
}
