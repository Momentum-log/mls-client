# PRD: Shipping Quote Endpoint Update and Hero CTA Swap

## 1. Introduction / Overview

This feature updates the marketing shipping quote experience to use a new backend endpoint, `/get-shipping-quote`, for the existing shipping estimate flow. The goal is to make the quote request path align with the new backend contract while keeping the current user experience intact.

In parallel, the homepage hero should be updated so that **Get a Quote** becomes the primary call to action and **Get Started** becomes the secondary call to action. This should improve the visibility of the quote flow for new visitors and make the marketing page more conversion-focused.

## 2. Goals

1. Route the existing shipping estimate page through the new `/get-shipping-quote` endpoint.
2. Preserve the current shipping estimate form behavior and response rendering if the request/response shape remains the same.
3. Make **Get a Quote** the main hero action on the marketing homepage.
4. Make **Get Started** the secondary hero action.
5. Improve conversion from homepage visitors into quote requests.

## 3. User Stories

1. As a visitor on the homepage, I want to see a clear **Get a Quote** button first so I know how to begin pricing a shipment.
2. As a visitor, I want a secondary **Get Started** action so I can still create an account or continue onboarding if I am not ready to request a quote.
3. As a user filling out the shipping estimate form, I want my quote request to use the current backend endpoint so I receive pricing from the latest API.
4. As a user, I want the quote results to still display normally after the endpoint change so I do not experience a broken or confusing flow.

## 4. Features / Tasks

### Quote Endpoint Integration (QI)

- **QI01**: Update the shipping estimate flow to call `/get-shipping-quote` instead of the current quote endpoint.
- **QI02**: Reuse the existing request and response handling if the new endpoint keeps the same payload shape and response structure.
- **QI03**: Keep the current quote rendering, loading, and error states on the shipping estimate page unchanged unless the new endpoint requires a specific adjustment.
- **QI04**: Confirm the quote hook and API layer use the shared project integration pattern so the endpoint change stays isolated from the UI.

### Marketing Hero CTA (HC)

- **HC01**: Change the homepage hero so **Get a Quote** is the primary CTA.
- **HC02**: Change the homepage hero so **Get Started** is the secondary CTA.
- **HC03**: Ensure the primary CTA points to the shipping estimate flow.
- **HC04**: Ensure the secondary CTA points to the onboarding or registration path used by the current marketing experience.
- **HC05**: Keep the hero layout, typography, and visual hierarchy consistent while swapping the CTA emphasis.

## 5. Non-Goals

- This feature does not redesign the homepage hero beyond the CTA priority change.
- This feature does not change the shipping estimate form fields, validation rules, or quote summary layout.
- This feature does not introduce a new quote UI.
- This feature does not modify backend pricing logic beyond using the new endpoint.
- This feature does not add new account or checkout functionality.

## 6. Design Considerations

- The hero should continue to read clearly on desktop and mobile after the CTA swap.
- The primary CTA should be visually stronger than the secondary CTA.
- The shipping estimate page should keep its existing layout and feedback states so the endpoint change feels invisible to the user.

## 7. Technical Considerations

- The shipping estimate flow already uses a dedicated hook and helper structure, so the endpoint change should be made in the API or hook layer rather than directly inside the page component.
- The new `/get-shipping-quote` endpoint is expected to behave like the current quote endpoint, with the same payload and response shape unless the backend contract says otherwise.
- If the endpoint already exists, the task should only update the client integration to use it.
- If the endpoint does not yet exist in the client API layer, it should be added in the existing feature-based API structure and then consumed by the quote hook.

## 8. Success Metrics

- The shipping estimate page successfully requests quotes from `/get-shipping-quote`.
- Quote results still render correctly after the endpoint switch.
- Homepage traffic sees **Get a Quote** as the first and most prominent CTA.
- More users click through from the homepage to the shipping estimate flow.
- Fewer users miss the quote entry point because of CTA ordering.

## 9. Open Questions

- None. The scope is limited to the shipping estimate flow and the marketing hero CTA swap, and the endpoint payload/response is assumed to stay the same.
