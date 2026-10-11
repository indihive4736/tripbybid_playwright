import { type Page, type Locator, expect } from '@playwright/test';
import { CreateBookingLocators } from '../locators/CreateBookingLocators';
import { type FlightRequest, type TrainRequest, type HotelRequest, type LocationPick } from '../data/bookingData';
import { formatDayLabel } from '../utils/dates';

export type RequestType = 'flight' | 'train' | 'hotel';

const REQUEST_TYPE_RADIO: Record<RequestType, RegExp> = {
    flight: /^Flights/,
    train: /^Trains/,
    hotel: /^Hotels/,
};

export const SUCCESS_TOAST = 'Booking request created successfully';

export interface SummaryExpectation {
    title?: string | RegExp;
    departure?: string | RegExp;
    travellers?: string | RegExp;
    budget?: string | RegExp;
}

export class CreateBookingPage {

    readonly page: Page;
    readonly el: ReturnType<typeof CreateBookingLocators>;

    constructor(page: Page) {
        this.page = page;
        this.el = CreateBookingLocators(page);
    }

    async goto_createBooking(type?: RequestType) {
        await this.page.goto(type ? `/create-booking?type=${type}` : '/create-booking');
        // The form is client-rendered and can take a while on a cold load
        await expect(this.el.heading).toBeVisible({ timeout: 20_000 });
    }

    async selectRequestType(type: RequestType) {
        const radio = this.el.requestTypeRadio(REQUEST_TYPE_RADIO[type]);
        await radio.click();
        await expect(radio).toBeChecked();
    }

    // ---- shared widgets -------------------------------------------------

    /** Opens a location popover, types the query and picks the matching option. */
    async pickLocation(trigger: Locator, label: string, pick: LocationPick) {
        await trigger.click();
        await this.el.searchCombobox(label).fill(pick.query);
        await this.el.option(pick.option).first().click();
        await expect(this.el.popover).toBeHidden();
    }

    /** Opens a day picker, pages forward until the date's month is shown, then clicks the day. */
    async pickDate(trigger: Locator, date: Date) {
        await trigger.click();
        await expect(this.el.popover).toBeVisible();
        const day = this.el.dayButton(formatDayLabel(date));
        for (let i = 0; i < 12 && !(await day.isVisible()); i++) {
            await this.el.nextMonthButton.click();
        }
        await day.click();
        await expect(this.el.popover).toBeHidden();
    }

    /** Clicks More/Fewer until the counter (adults, children, rooms, ...) shows the target. */
    async setCounter(label: string, target: number) {
        const groupName = label.charAt(0).toUpperCase() + label.slice(1);
        const value = this.el.counterValue(groupName);
        let current = parseInt((await value.innerText()).trim(), 10);
        while (current < target) {
            await this.el.counterMore(label).click();
            current++;
        }
        while (current > target) {
            await this.el.counterFewer(label).click();
            current--;
        }
        await expect(value).toHaveText(String(target));
    }

    /** Radix Select: open the trigger and click the option. */
    async selectRadixOption(trigger: Locator, option: string) {
        await trigger.click();
        await this.el.selectOption(option).click();
    }

    async openAdditionalPreferences() {
        const button = this.el.additionalPrefsButton;
        if ((await button.getAttribute('aria-expanded')) !== 'true') {
            await button.click();
        }
        await expect(button).toHaveAttribute('aria-expanded', 'true');
    }

    // ---- per-type fill --------------------------------------------------

    async fillFlightRequest(d: FlightRequest) {
        const f = this.el.flight;
        await this.selectRequestType('flight');
        await f.tripTypeRadio(d.tripType).click();
        await this.pickLocation(f.fromLocation, 'From', d.from);
        await this.pickLocation(f.toLocation, 'To', d.to);
        await this.pickDate(f.departDate, d.departDate);
        if (d.returnDate) {
            await this.pickDate(f.returnDate, d.returnDate);
        }
        await f.budget.fill(String(d.budget));
        await this.setCounter('adults', d.adults);
        await this.setCounter('children', d.children);
        await this.setCounter('infants', d.infants);
        await f.cabinClassRadio(d.cabinClass).click();

        if (d.nonStopOnly || d.flexibleDates || d.preferredAirline || d.notes) {
            await this.openAdditionalPreferences();
            if (d.nonStopOnly) await f.nonStopToggle.click();
            if (d.flexibleDates) await f.flexibleDatesToggle.click();
            if (d.preferredAirline) await f.preferredAirline.fill(d.preferredAirline);
            if (d.notes) await f.requirements.fill(d.notes);
        }
    }

    async fillTrainRequest(d: TrainRequest) {
        const t = this.el.train;
        await this.selectRequestType('train');
        await this.pickLocation(t.fromLocation, 'From station', d.from);
        await this.pickLocation(t.toLocation, 'To station', d.to);
        await this.pickDate(t.journeyDate, d.journeyDate);
        await t.budget.fill(String(d.budget));
        await this.setCounter('adults', d.adults);
        await this.setCounter('children', d.children);
        await this.setCounter('seniors', d.seniors);
        await t.trainClassRadio(d.trainClass).click();

        if (d.travelInsurance || d.quota || d.berth || d.food || d.preferredDepartureTime || d.notes) {
            await this.openAdditionalPreferences();
            if (d.travelInsurance) await t.travelInsuranceToggle.click();
            if (d.quota) await this.selectRadixOption(t.quotaSelect, d.quota);
            if (d.berth) await this.selectRadixOption(t.berthSelect, d.berth);
            if (d.food) await this.selectRadixOption(t.foodSelect, d.food);
            if (d.preferredDepartureTime) await t.preferredDepartureTime.fill(d.preferredDepartureTime);
            if (d.notes) await t.requirements.fill(d.notes);
        }
    }

    async fillHotelRequest(d: HotelRequest) {
        const h = this.el.hotel;
        await this.selectRequestType('hotel');
        await this.pickLocation(h.city, 'City or destination', d.city);
        await this.pickDate(h.checkInDate, d.checkInDate);
        await this.pickDate(h.checkOutDate, d.checkOutDate);
        await h.budget.fill(String(d.budgetPerNight));
        await this.setCounter('rooms', d.rooms);
        await this.setCounter('adults', d.adults);
        await this.setCounter('children', d.children);

        const hasPrefs = d.mustHaves?.length || d.roomType || d.bedPreference || d.starRating
            || d.cancellationPolicy || d.preferredArea || d.notes;
        if (hasPrefs) {
            await this.openAdditionalPreferences();
            for (const amenity of d.mustHaves ?? []) {
                await h.mustHaveToggle(amenity).click();
            }
            if (d.roomType) await this.selectRadixOption(h.roomTypeSelect, d.roomType);
            if (d.bedPreference) await this.selectRadixOption(h.bedPreferenceSelect, d.bedPreference);
            if (d.starRating) await this.selectRadixOption(h.starRatingSelect, d.starRating);
            if (d.cancellationPolicy) await this.selectRadixOption(h.cancellationPolicySelect, d.cancellationPolicy);
            if (d.preferredArea) await h.preferredArea.fill(d.preferredArea);
            if (d.notes) await h.requirements.fill(d.notes);
        }
    }

    // ---- submit & assertions -------------------------------------------

    /** Posts the request. This creates a real booking in the account. */
    async submit() {
        await this.el.postRequestButton.click();
    }

    async expectSubmitted() {
        const toast = this.page.getByRole('region', { name: 'Notifications alt+T' });
        await expect(toast).toContainText(SUCCESS_TOAST, { timeout: 20_000 });
    }

    async expectSummary(s: SummaryExpectation) {
        if (s.title) await expect(this.el.summaryTitle).toHaveText(s.title);
        if (s.departure) await expect(this.el.summary).toContainText(s.departure);
        if (s.travellers) await expect(this.el.summary).toContainText(s.travellers);
        if (s.budget) await expect(this.el.summary).toContainText(s.budget);
    }

    async expectValidationError(text: string) {
        await expect(this.page.getByText(text).first()).toBeVisible();
    }

}
