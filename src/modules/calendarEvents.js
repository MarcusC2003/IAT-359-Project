// src/modules/calendarEvents.js
import { db, firebase_auth } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const EVENTS_COLLECTION = "calendarEvents";

/**
 * Create a basic calendar event for the current user.
 * Required: title, startDate
 * Optional: endDate, note
 */
export const createEventForCurrentUser = async ({
  title,
  startDate,
  endDate,
  note,
}) => {
  if (!title || !startDate) {
    throw new Error("title and startDate are required.");
  }

  const user = firebase_auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const start =
    startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate
    ? endDate instanceof Date
      ? endDate
      : new Date(endDate)
    : null;

  const dateCreated = new Date();

  await addDoc(collection(db, EVENTS_COLLECTION), {
    userId: user.uid,
    title,
    startDate: start,
    ...(end && { endDate: end }),
    note: note || "",
    dateCreated,
  });
};

/**
 * Listen to events for the current user, ordered by startDate.
 * Calls onUpdate(eventsArray) whenever data changes.
 * Returns unsubscribe function.
 */
export const subscribeToEventsForCurrentUser = (onUpdate) => {
  const user = firebase_auth.currentUser;
  if (!user) {
    onUpdate([]);
    return () => {};
  }

  const q = query(
    collection(db, EVENTS_COLLECTION),
    where("userId", "==", user.uid),
    orderBy("startDate", "asc") // <- index: userId + startDate (ascending)
  );

  const unsub = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        let startDate = data.startDate;
        if (startDate && typeof startDate.toDate === "function") {
          startDate = startDate.toDate();
        }

        let endDate = data.endDate;
        if (endDate && typeof endDate.toDate === "function") {
          endDate = endDate.toDate();
        }

        let dateCreated = data.dateCreated;
        if (dateCreated && typeof dateCreated.toDate === "function") {
          dateCreated = dateCreated.toDate();
        }

        return {
          id: docSnap.id,
          ...data,
          startDate,
          endDate,
          dateCreated,
        };
      });

      onUpdate(items);
    },
    (error) => {
      console.error("Calendar events listener error:", error);
      onUpdate([]);
    }
  );

  return unsub;
};
