"use client";

import { useState } from "react";

interface EventObjectType {
  [key: string]: unknown;
}

export default function EventObject() {
  const [event, setEvent] = useState<EventObjectType | null>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Create a clean event object with only serializable properties
    const eventObj: EventObjectType = {
      type: e.type,
      target: (e.target as HTMLElement).outerHTML,
      currentTarget: (e.currentTarget as HTMLElement).outerHTML,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      defaultPrevented: e.defaultPrevented,
      eventPhase: e.eventPhase,
      isTrusted: e.isTrusted,
      timeStamp: e.timeStamp,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      button: e.button,
      buttons: e.buttons,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      detail: e.detail,
      relatedTarget: e.relatedTarget ? (e.relatedTarget as HTMLElement).outerHTML : null,
    };
    setEvent(eventObj);
  };
  return (
    <div>
      <h2>Event Object</h2>
      <button onClick={(e) => handleClick(e)}
        className="btn btn-primary"
        id="wd-display-event-obj-click">
        Display Event Object
      </button>
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <hr/>
    </div>
);}
