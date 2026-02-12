export default class DatePicker {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;

    this.container = document.getElementById(id);
    if (!this.container) throw new Error(`DatePicker: div with id="${id}" not found`);

    this.displayDate = null;

    this.container.addEventListener("click", (e) => this.handleClick(e));
  }

  render(date) {
    this.displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.container.innerHTML = "";
  }

  handleClick(e) {
    const target = e.target;

    const actionEl = target.closest("[data-action]");
    if (actionEl) {
      const action = actionEl.getAttribute("data-action");
      const d = new Date(this.displayDate);

      if (action === "prev") {
        d.setMonth(d.getMonth() - 1);
      } else if (action === "next") {
        d.setMonth(d.getMonth() + 1);
      }

      this.render(d);
      return;
    }

    const dayEl = target.closest('[data-role="day"]');
    if (!dayEl) return;

    const isCurrent = dayEl.getAttribute("data-current") === "true";
    if (!isCurrent) return;

    const year = parseInt(dayEl.getAttribute("data-year"), 10);
    const month = parseInt(dayEl.getAttribute("data-month"), 10);
    const day = parseInt(dayEl.getAttribute("data-day"), 10);

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return;

    this.callback(this.id, { month, day, year });
  }
}
