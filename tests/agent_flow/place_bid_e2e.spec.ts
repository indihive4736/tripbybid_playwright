import { test } from '../fixtures';
import { type Page } from '@playwright/test';
import { CreateBookingPage, type RequestType } from '../../pages/CreateBookingPage';
import { BrowseRequestsPage } from '../../pages/BrowseRequestsPage';
import { BidDrawerPage } from '../../pages/BidDrawerPage';
import { MyBidsPage } from '../../pages/MyBidsPage';
import { defaultHotel, defaultTrain } from '../../data/bookingData';
import { airports } from '../../data/airports';
import { randomBid } from '../../data/bidData';
import { randomFlightRequest, uniqueToken } from '../../utils/random';

/** Posts a request of the given type as the traveller, tagged with `token` at the start of its notes. */
async function postTravellerRequest(travellerPage: Page, type: RequestType, token: string) {
    const notes = `${token} Automated test request - please ignore.`;
    const createBooking = new CreateBookingPage(travellerPage);
    await createBooking.goto_createBooking(type);

    if (type === 'flight') await createBooking.fillFlightRequest({ ...randomFlightRequest(airports), notes });
    if (type === 'train') await createBooking.fillTrainRequest({ ...defaultTrain, notes });
    if (type === 'hotel') await createBooking.fillHotelRequest({ ...defaultHotel, notes });

    await createBooking.submit();
    await createBooking.expectSubmitted();
}

/**
 * End to end across both roles: the traveller posts a fresh request, the agent finds it
 * by its unique token and bids on it. Bids are left active on purpose, so the traveller
 * account collects bids for later accept / pay tests.
 */
test.describe('Agent places a bid on a new traveller request', () => {

    for (const type of ['flight', 'train', 'hotel'] as const) {
        test(`Test case: Bid on a new ${type} request`, async ({ page, travellerPage }) => {
            const token = uniqueToken();
            test.info().annotations.push({ type: 'token', description: token });

            await test.step('traveller posts the request', async () => {
                await postTravellerRequest(travellerPage, type, token);
            });

            const browse = new BrowseRequestsPage(page);
            const drawer = new BidDrawerPage(page);
            let title = '';
            let price = 0;

            await test.step('agent finds the request and places a bid', async () => {
                title = await browse.openRequestWithText(token);
                const bid = randomBid(type, await drawer.readBudget());
                price = bid.price;
                test.info().annotations.push({ type: 'bid', description: `${title} · ₹${price} · ${bid.cancellationPolicy}` });

                await drawer.fillBid(bid);
                await drawer.expectSummary(bid.price);
                await drawer.submit();
                await drawer.expectPlaced();
            });

            await test.step('bid shows under My bids → Active', async () => {
                const myBids = new MyBidsPage(page);
                await myBids.goto_myBids();
                await myBids.expectActiveBid(title, price);
            });
        });
    }

});
