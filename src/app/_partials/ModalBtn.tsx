"use client";

import { getCurrentPositionPromise } from "@/helper/geo";
import ReminderModal, { Reminder } from "./ReminderModal";

export default function ModalBtn() {
  function handleCreate(r: Reminder) {
    // Save to your backend / supabase / local storage
    console.log("New reminder:", r);
  }

  async function getGeo() {
    const pos = await getCurrentPositionPromise({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    console.log(pos);
  }

  getGeo();

  return (
    <ReminderModal onCreate={handleCreate} triggerText="Set Visit Reminder" />
  );
}
