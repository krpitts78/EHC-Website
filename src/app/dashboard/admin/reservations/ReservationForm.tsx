"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createReservationAdminAction,
  updateReservationAdminAction,
  type AdminReservationState,
} from "./actions";

export type MemberOption = {
  id: string;
  first_name: string;
  last_name: string;
  member_number: string;
};

export type ReservationDefaults = {
  id?: string;
  member_id: string | null;
  kind: string;
  start_date: string;
  end_date: string;
  is_prime: boolean;
  rate_dollars: string;
  cleaning_fee_dollars: string;
  status: string;
  deposit_paid: boolean;
  balance_paid: boolean;
  notes: string;
};

export function ReservationForm({
  mode,
  members,
  defaults,
}: {
  mode: "create" | "edit";
  members: MemberOption[];
  defaults: ReservationDefaults;
}) {
  const action =
    mode === "create"
      ? createReservationAdminAction
      : updateReservationAdminAction;
  const [state, formAction, pending] = useActionState<
    AdminReservationState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {defaults.id && <input type="hidden" name="id" value={defaults.id} />}

      <Field label="Member">
        <select
          name="member_id"
          defaultValue={defaults.member_id ?? ""}
          className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
        >
          <option value="">— None (block / event) —</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.last_name}, {m.first_name} ({m.member_number})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-[#5a6470]/70">
          Required for rentals. Leave blank for blocks or club events.
        </p>
      </Field>

      <Field label="Kind">
        <select
          name="kind"
          defaultValue={defaults.kind}
          className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
        >
          <option value="rental">Rental</option>
          <option value="block">Block</option>
          <option value="event">Event</option>
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date">
          <input
            type="date"
            name="start_date"
            required
            defaultValue={defaults.start_date}
            className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
          />
          <p className="mt-1 text-xs text-[#5a6470]/70">
            Rentals must start on a Friday.
          </p>
        </Field>
        <Field label="End date">
          <input
            type="date"
            name="end_date"
            required
            defaultValue={defaults.end_date}
            className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
          />
        </Field>
      </div>

      <Field label="Status">
        <select
          name="status"
          defaultValue={defaults.status}
          className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
        >
          <option value="requested">Requested</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Rate ($)">
          <input
            type="number"
            min="0"
            step="0.01"
            name="rate_dollars"
            defaultValue={defaults.rate_dollars}
            className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
          />
        </Field>
        <Field label="Cleaning fee ($)">
          <input
            type="number"
            min="0"
            step="0.01"
            name="cleaning_fee_dollars"
            defaultValue={defaults.cleaning_fee_dollars}
            className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
          />
        </Field>
      </div>

      <div className="space-y-2">
        <Checkbox
          name="is_prime"
          label="Prime week"
          defaultChecked={defaults.is_prime}
        />
        <Checkbox
          name="deposit_paid"
          label="Deposit paid"
          defaultChecked={defaults.deposit_paid}
        />
        <Checkbox
          name="balance_paid"
          label="Balance paid"
          defaultChecked={defaults.balance_paid}
        />
      </div>

      <Field label="Notes">
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaults.notes}
          className="w-full rounded border border-[#a8a395] bg-white px-2 py-1 text-sm"
        />
      </Field>

      {state.error && (
        <p className="rounded border border-red-500/40 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[#BF5700] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a3500] disabled:opacity-50"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create reservation"
              : "Save changes"}
        </button>
        <Link
          href="/dashboard/admin/reservations"
          className="rounded border border-[#a8a395] px-4 py-2 text-sm text-[#5a6470] hover:bg-[#D6D2C4]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#1a2128]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#1a2128]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-[#a8a395]"
      />
      {label}
    </label>
  );
}
