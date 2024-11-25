const initialEvents = [
  { start: 30, end: 150 }, // 9:30 AM - 11:30 AM
  { start: 60, end: 150 }, // 10:00 AM - 11:30 AM
  { start: 540, end: 600 }, // 6:00 PM - 7:00 PM
  { start: 610, end: 670 }, // 7:10 PM - 8:10 PM
  { start: 560, end: 620 }, // 6:20 PM - 7:20 PM
];

const eventsContainer = document.getElementById("events-container");
const timeLabelsContainer = document.getElementById("time-labels");

function generateTimeLabels() {
  for (let i = 0; i <= 720; i += 30) {
    const hour = Math.floor(i / 60) + 9; 
    const minutes = i % 60;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;

    const time = `${displayHour}:${minutes === 0 ? "00" : "30"} ${ampm}`;
    const label = document.createElement("div");
    label.className = `time-label ${minutes === 30 ? "half-hour" : ""}`;
    label.innerText = time;
    timeLabelsContainer.appendChild(label);
  }
}

function layOutDay(events) {
  const calendar = document.getElementById("events-container");

  calendar.innerHTML = "";

  events.sort((a, b) => a.start - b.start);

  const columns = []; 
  const eventOverlapMap = new Map(); 

  events.forEach((event) => {
    let placed = false;

    for (let column of columns) {
      if (column[column.length - 1].end <= event.start) {
        column.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([event]);
    }
  });

  events.forEach((event) => {
    const overlappingEvents = events.filter(
      (otherEvent) =>
        event !== otherEvent &&
        !(event.end <= otherEvent.start || event.start >= otherEvent.end)
    );
    eventOverlapMap.set(event, overlappingEvents.length > 0);
  });

  const totalWidth = 600; 
  const padding = 10; 
  const availableWidth = totalWidth - 2 * padding;

  columns.forEach((column, colIndex) => {
    const columnWidth = availableWidth / columns.length;

    column.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("event");

      const isOverlapping = eventOverlapMap.get(event);

      eventElement.style.top = `${(event.start / (12 * 60)) * 100}%`;
      eventElement.style.height = `${
        ((event.end - event.start) / (12 * 60)) * 100
      }%`;

      if (!isOverlapping) {
        eventElement.style.width = `calc(100% - ${2 * padding}px)`;
        eventElement.style.left = `${padding}px`;
      } else {
        eventElement.style.width = `${columnWidth - padding}px`;
        eventElement.style.left = `${colIndex * columnWidth + padding}px`;
      }

      eventElement.innerHTML = `<p>Sample Item</p>Sample Location`;

      calendar.appendChild(eventElement);
    });
  });
}

generateTimeLabels();
layOutDay(initialEvents);
