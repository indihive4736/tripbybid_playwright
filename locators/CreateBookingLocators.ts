import { type Page } from "@playwright/test";

/** Locators for the /create-booking request form (Flights / Trains / Hotels). */
export const CreateBookingLocators = (page: Page) => {
    const summary = page.getByRole('complementary', { name: 'Request summary' });
    const popover = page.getByRole('dialog');

    return {
        heading: page.getByRole('heading', { level: 1, name: 'Where to next?' }),
        form: page.getByRole('form', { name: 'Request details' }),
        requestTypeGroup: page.getByRole('radiogroup', { name: 'Request type' }),
        requestTypeRadio: (name: RegExp) => page.getByRole('radiogroup', { name: 'Request type' }).getByRole('radio', { name }),

        summary,
        // The sidebar has a second h2 ("What happens next"), so pin the title by id
        summaryTitle: summary.locator('#request-summary-title'),
        postRequestButton: page.getByRole('button', { name: /^(Post request to agents|Posting…)$/ }),
        additionalPrefsButton: page.getByRole('button', { name: /^Additional preferences/ }),

        // Radix popovers: location autocomplete and day pickers
        popover,
        searchCombobox: (label: string) => popover.getByRole('combobox', { name: `Search ${label}` }),
        listbox: (label: string) => popover.getByRole('listbox', { name: label }),
        option: (name: RegExp | string) => popover.getByRole('option', { name }),
        dayButton: (name: string) => popover.getByRole('button', { name }),
        nextMonthButton: popover.getByRole('button', { name: 'Go to the Next Month' }),
        previousMonthButton: popover.getByRole('button', { name: 'Go to the Previous Month' }),

        // Passenger / room counters
        counterMore: (label: string) => page.getByRole('button', { name: `More ${label}` }),
        counterFewer: (label: string) => page.getByRole('button', { name: `Fewer ${label}` }),
        counterValue: (label: string) => page.getByRole('group', { name: label }).getByRole('status'),

        // Radix Select options (shared by train and hotel selects)
        selectOption: (name: string) => page.getByRole('option', { name, exact: true }),

        flight: {
            tripTypeRadio: (name: string) => page.getByRole('radio', { name, exact: true }),
            fromLocation: page.locator('#flight-fromLocation'),
            toLocation: page.locator('#flight-toLocation'),
            swapButton: page.getByRole('button', { name: 'Swap origin and destination' }),
            departDate: page.locator('#flight-departDate'),
            returnDate: page.locator('#flight-returnDate'),
            budget: page.locator('#flight-budget'),
            cabinClassRadio: (name: string) => page.getByRole('radiogroup', { name: 'Cabin class' }).getByRole('radio', { name, exact: true }),
            optionsGroup: page.getByRole('group', { name: 'Flight options' }),
            nonStopToggle: page.getByRole('button', { name: 'Non-stop flights only' }),
            flexibleDatesToggle: page.getByRole('button', { name: 'Flexible dates' }),
            preferredAirline: page.locator('#flight-preferredAirline'),
            requirements: page.locator('#flight-requirements'),
        },

        train: {
            fromLocation: page.locator('#train-fromLocation'),
            toLocation: page.locator('#train-toLocation'),
            journeyDate: page.locator('#train-journeyDate'),
            quickDates: page.getByRole('group', { name: 'Quick dates' }),
            budget: page.locator('#train-budget'),
            trainClassRadio: (name: string) => page.getByRole('radiogroup', { name: 'Train class' }).getByRole('radio', { name, exact: true }),
            travelInsuranceToggle: page.getByRole('group', { name: 'Cover' }).getByRole('button', { name: 'Travel insurance' }),
            quotaSelect: page.locator('#train-quota'),
            berthSelect: page.locator('#train-berthPreference'),
            foodSelect: page.locator('#train-foodPreference'),
            preferredDepartureTime: page.locator('#train-preferredDepartureTime'),
            requirements: page.locator('#train-requirements'),
        },

        hotel: {
            city: page.locator('#hotel-city'),
            checkInDate: page.locator('#hotel-checkInDate'),
            checkOutDate: page.locator('#hotel-checkOutDate'),
            budget: page.locator('#hotel-budget'),
            mustHaveToggle: (name: string) => page.getByRole('group', { name: 'Must-haves' }).getByRole('button', { name, exact: true }),
            roomTypeSelect: page.locator('#hotel-roomType'),
            bedPreferenceSelect: page.locator('#hotel-bedPreference'),
            starRatingSelect: page.locator('#hotel-starRating'),
            cancellationPolicySelect: page.locator('#hotel-cancellationPolicy'),
            preferredArea: page.locator('#hotel-area'),
            requirements: page.locator('#hotel-requirements'),
        },
    };
}
