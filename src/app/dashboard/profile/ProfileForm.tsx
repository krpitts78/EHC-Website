"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileState } from "./actions";

const initial: ProfileState = {};

type Member = {
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  suffix: string | null;
  spouse_name: string | null;
  phone_home: string | null;
  phone_work: string | null;
  phone_cell: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  defaultValue: string | null;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-[#D6D2C4]">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded border border-[#333F48] bg-[#222b33] px-3 py-2 text-white focus:border-[#BF5700] focus:outline-none"
      />
    </label>
  );
}

export function ProfileForm({ member }: { member: Member }) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initial,
  );

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="First name"
          name="first_name"
          defaultValue={member.first_name}
          autoComplete="given-name"
        />
        <Field
          label="Last name"
          name="last_name"
          defaultValue={member.last_name}
          autoComplete="family-name"
        />
        <Field
          label="Preferred name / nickname"
          name="preferred_name"
          defaultValue={member.preferred_name}
        />
        <Field
          label="Suffix (Jr / III / etc)"
          name="suffix"
          defaultValue={member.suffix}
        />
        <Field
          label="Spouse"
          name="spouse_name"
          defaultValue={member.spouse_name}
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#D6D2C4]/70">
          Phone
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field
            label="Cell"
            name="phone_cell"
            defaultValue={member.phone_cell}
            type="tel"
            autoComplete="tel"
          />
          <Field
            label="Home"
            name="phone_home"
            defaultValue={member.phone_home}
            type="tel"
          />
          <Field
            label="Work"
            name="phone_work"
            defaultValue={member.phone_work}
            type="tel"
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#D6D2C4]/70">
          Address
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Field
              label="Street / PO Box"
              name="address_line1"
              defaultValue={member.address_line1}
              autoComplete="street-address"
            />
          </div>
          <div className="sm:col-span-3">
            <Field
              label="City"
              name="city"
              defaultValue={member.city}
              autoComplete="address-level2"
            />
          </div>
          <div className="sm:col-span-1">
            <Field
              label="State"
              name="state"
              defaultValue={member.state}
              autoComplete="address-level1"
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="ZIP"
              name="zip"
              defaultValue={member.zip}
              autoComplete="postal-code"
            />
          </div>
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-green-400">Saved.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[#BF5700] px-5 py-2 font-medium text-white hover:bg-[#7a3500] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
