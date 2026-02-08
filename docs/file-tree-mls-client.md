# File Tree: mls-client

**Generated:** 2/8/2026, 12:05:04 PM
**Root Path:** `/Users/adedotungabriel/work/me/mls/mls-client`

```
├── 📁 .agent
│   └── 📁 rules
│       ├── 📝 api-integration-guide.md
│       └── 📝 instructions.md
├── 📁 .github
│   └── 📝 copilot-instructions.md
├── 📁 api
│   ├── 📁 auth
│   │   └── 📄 index.ts
│   ├── 📁 location
│   │   └── 📄 index.ts
│   ├── 📁 payments
│   │   └── 📄 index.ts
│   ├── 📁 shipments
│   │   └── 📄 index.ts
│   ├── 📁 utils
│   └── 📄 index.ts
├── 📁 app
│   ├── 📁 (marketing)
│   │   ├── 📁 about
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 contact
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 cookies
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 login
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 privacy
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 register
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 shipping-estimate
│   │   │   ├── 📄 constants.ts
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📄 schema.ts
│   │   │   └── 📄 utils.ts
│   │   ├── 📁 terms
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 track-shipment
│   │   │   ├── 📁 [id]
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 not-found.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 app
│   │   ├── 📁 account
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 dashboard
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 shipments
│   │   │   ├── 📁 [id]
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 new
│   │   │   │   ├── 📁 destination
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 origin
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 package
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 service
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 summary
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 verify
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📄 layout.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 track
│   │   │   └── 📄 page.tsx
│   │   ├── 📄 layout.tsx
│   │   └── 📄 not-found.tsx
│   ├── 📁 auth
│   │   └── 📁 forgot-password
│   │       └── 📄 page.tsx
│   ├── 🎨 globals.css
│   ├── 📄 globals.d.ts
│   ├── 📄 layout.tsx
│   └── 📄 not-found.tsx
├── 📁 components
│   ├── 📁 about
│   │   ├── 📄 about-hero.tsx
│   │   ├── 📄 global-mindset-showcase.tsx
│   │   ├── 📄 global-network-showcase.tsx
│   │   ├── 📄 innovation-showcase.tsx
│   │   ├── 📄 mission-showcase.tsx
│   │   ├── 📄 mission-vision.tsx
│   │   ├── 📄 partnership-showcase.tsx
│   │   ├── 📄 problem-solution.tsx
│   │   ├── 📄 trust-showcase.tsx
│   │   └── 📄 vision-showcase.tsx
│   ├── 📁 account
│   │   ├── 📄 AccountStack.tsx
│   │   ├── 📄 ChangePasswordForm.tsx
│   │   ├── 📄 EmailChangeModal.tsx
│   │   ├── 📄 LogoutAction.tsx
│   │   ├── 📄 ProfileCard.tsx
│   │   ├── 📄 ProfileForm.tsx
│   │   ├── 📄 VerificationBanner.tsx
│   │   ├── 📄 VerifyEmailModal.tsx
│   │   └── 📄 VerifyPhoneModal.tsx
│   ├── 📁 auth
│   │   ├── 📄 auth-showcase.tsx
│   │   ├── 📄 guest-id-initializer.tsx
│   │   ├── 📄 login-form.tsx
│   │   ├── 📄 profile-form.tsx
│   │   └── 📄 register-form.tsx
│   ├── 📁 dashboard
│   │   └── 📄 sidebar-nav.tsx
│   ├── 📁 home
│   │   ├── 📄 cta-section.tsx
│   │   ├── 📄 dashboard-showcase.tsx
│   │   ├── 📄 heavy-freight-section.tsx
│   │   ├── 📄 heavy-freight-showcase.tsx
│   │   ├── 📄 hero.tsx
│   │   ├── 📄 how-it-works-step.tsx
│   │   ├── 📄 how-it-works.tsx
│   │   ├── 📄 quote-estimator-showcase.tsx
│   │   ├── 📄 receipt-showcase.tsx
│   │   ├── 📄 shipment-showcase.tsx
│   │   ├── 📄 simplified-logistics-showcase.tsx
│   │   ├── 📄 tracking-showcase.tsx
│   │   ├── 📄 tracking-step-showcase.tsx
│   │   └── 📄 value-prop.tsx
│   ├── 📁 layout
│   │   ├── 📄 footer.tsx
│   │   ├── 📄 header.tsx
│   │   └── 📄 mobile-header.tsx
│   ├── 📁 providers
│   │   ├── 📄 QueryProvider.tsx
│   │   ├── 📄 toast-provider.tsx
│   │   └── 📄 verification-provider.tsx
│   ├── 📁 shared
│   │   ├── 📄 address-fields.tsx
│   │   ├── 📄 container.tsx
│   │   ├── 📄 country-detector.tsx
│   │   ├── 📄 country-selector.tsx
│   │   ├── 📄 faq-section.tsx
│   │   └── 📄 header-country-selector.tsx
│   ├── 📁 shipment
│   │   ├── 📄 address-form.tsx
│   │   ├── 📄 package-form.tsx
│   │   ├── 📄 service-selection.tsx
│   │   ├── 📄 stacked-section.tsx
│   │   ├── 📄 stepper.tsx
│   │   ├── 📄 summary-drawer.tsx
│   │   └── 📄 vertical-timeline.tsx
│   ├── 📁 shipping
│   │   ├── 📄 estimate-form.tsx
│   │   ├── 📄 rate-selection.tsx
│   │   ├── 📄 shipping-hero.tsx
│   │   └── 📄 shipping-process-showcase.tsx
│   ├── 📁 tracking
│   │   ├── 📄 PublicTrackingResult.tsx
│   │   ├── 📄 RecentShipments.tsx
│   │   ├── 📄 TrackingDetails.tsx
│   │   ├── 📄 TrackingOverview.tsx
│   │   ├── 📄 TrackingSearch.tsx
│   │   └── 📄 TrackingTimelineView.tsx
│   └── 📁 ui
│       ├── 📄 action-menu.tsx
│       ├── 📄 button.tsx
│       ├── 📄 copy-button.tsx
│       ├── 📄 heavy-shipment-modal.tsx
│       ├── 📄 input.tsx
│       ├── 📄 label.tsx
│       ├── 📄 modal.tsx
│       ├── 📄 not-found-view.tsx
│       ├── 📄 password-input.tsx
│       ├── 📄 phone-input.tsx
│       ├── 📄 select.tsx
│       └── 📄 toast.tsx
├── 📁 docs
│   ├── 📁 prd
│   │   ├── 📝 prd-auth-redirect.md
│   │   ├── 📝 prd-client-currency-display.md
│   │   ├── 📝 prd-continue-to-pay.md
│   │   ├── 📝 prd-copy-and-alignment.md
│   │   ├── 📝 prd-custom-404-page.md
│   │   ├── 📝 prd-dashboard-stats.md
│   │   ├── 📝 prd-global-shipping-ux.md
│   │   ├── 📝 prd-mobile-shipment-flow.md
│   │   ├── 📝 prd-phone-input.md
│   │   ├── 📝 prd-phone-verification.md
│   │   ├── 📝 prd-production-finalization.md
│   │   ├── 📝 prd-redesign-quick-shipment.md
│   │   ├── 📝 prd-shipment-enhancements.md
│   │   ├── 📝 prd-shipment-improvements.md
│   │   ├── 📝 prd-shipping-estimate-location.md
│   │   ├── 📝 prd-track-shipment.md
│   │   ├── 📝 prd-tracking-fix.md
│   │   ├── 📝 prd-unauthenticated-tracking.md
│   │   ├── 📝 prd-url-tracking.md
│   │   ├── 📝 prd-user-auth-flow.md
│   │   └── 📝 prd_tracking_improvement.md
│   ├── 📁 tasks
│   │   ├── 📝 tasks-auth-redirect.md
│   │   ├── 📝 tasks-client-currency-display.md
│   │   ├── 📝 tasks-continue-to-pay.md
│   │   ├── 📝 tasks-phone-verification.md
│   │   ├── 📝 tasks-production-finalization.md
│   │   ├── 📝 tasks-redesign-quick-shipment.md
│   │   ├── 📝 tasks-shipment-enhancements.md
│   │   ├── 📝 tasks-shipment-improvements.md
│   │   ├── 📝 tasks-shipping-estimate-location.md
│   │   ├── 📝 tasks-unauthenticated-tracking.md
│   │   └── 📝 tasks-user-auth-flow.md
│   ├── 📝 api-integration-guide.md
│   ├── 📝 client-side-implementation-plan.md
│   ├── 📝 cpanel-hosting-guide.md
│   ├── 📝 fedex-docs.md
│   ├── 📝 location-services-guide.md
│   ├── 📝 mls-dev-plan.md
│   ├── 📝 og-image-prompt.md
│   ├── 📝 phone-verification-client-guide.md
│   ├── 📝 prd-country-based-currency.md
│   ├── 📝 react-hot-toas-docs.md
│   ├── 📝 scratch.md
│   └── 📝 social-links.md
├── 📁 hooks
│   ├── 📁 auth
│   │   └── 📄 use-auth.ts
│   ├── 📁 location
│   │   └── 📄 use-location.ts
│   ├── 📁 shipments
│   │   ├── 📄 use-continue-payment.ts
│   │   ├── 📄 use-duplicate-shipment.ts
│   │   └── 📄 use-shipments.ts
│   ├── 📄 use-toast.ts
│   └── 📄 useAuth.ts
├── 📁 lib
├── 📁 public
│   ├── 📁 fonts
│   │   ├── 📄 Satoshi-Black.otf
│   │   ├── 📄 Satoshi-BlackItalic.otf
│   │   ├── 📄 Satoshi-Bold.otf
│   │   ├── 📄 Satoshi-BoldItalic.otf
│   │   ├── 📄 Satoshi-Italic.otf
│   │   ├── 📄 Satoshi-Light.otf
│   │   ├── 📄 Satoshi-LightItalic.otf
│   │   ├── 📄 Satoshi-Medium.otf
│   │   ├── 📄 Satoshi-MediumItalic.otf
│   │   ├── 📄 Satoshi-Regular.otf
│   │   ├── 📄 WorkSans-Black.ttf
│   │   ├── 📄 WorkSans-BlackItalic.ttf
│   │   ├── 📄 WorkSans-Bold.ttf
│   │   ├── 📄 WorkSans-BoldItalic.ttf
│   │   ├── 📄 WorkSans-ExtraBold.ttf
│   │   ├── 📄 WorkSans-ExtraBoldItalic.ttf
│   │   ├── 📄 WorkSans-ExtraLight.ttf
│   │   ├── 📄 WorkSans-ExtraLightItalic.ttf
│   │   ├── 📄 WorkSans-Italic.ttf
│   │   ├── 📄 WorkSans-Light.ttf
│   │   ├── 📄 WorkSans-LightItalic.ttf
│   │   ├── 📄 WorkSans-Medium.ttf
│   │   ├── 📄 WorkSans-MediumItalic.ttf
│   │   ├── 📄 WorkSans-Regular.ttf
│   │   ├── 📄 WorkSans-SemiBold.ttf
│   │   ├── 📄 WorkSans-SemiBoldItalic.ttf
│   │   ├── 📄 WorkSans-Thin.ttf
│   │   └── 📄 WorkSans-ThinItalic.ttf
│   ├── 📁 images
│   │   ├── 🖼️ logo-footer-ii.svg
│   │   ├── 🖼️ logo-footer.svg
│   │   ├── 🖼️ logo-landscape-white.svg
│   │   ├── 🖼️ logo-landscape.svg
│   │   ├── 🖼️ logo-square.svg
│   │   ├── 🖼️ logo-white.svg
│   │   └── 🖼️ og-image.png
│   ├── 🖼️ favicon.svg
│   ├── 🖼️ file.svg
│   ├── 🖼️ globe.svg
│   ├── 🖼️ next.svg
│   ├── 🖼️ og-image.svg
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
├── 📁 store
│   ├── 📄 auth-store.ts
│   ├── 📄 country-store.ts
│   ├── 📄 shipment-store.ts
│   └── 📄 utils-store.ts
├── 📁 types
│   ├── 📄 auth.ts
│   ├── 📄 country.ts
│   ├── 📄 location.ts
│   └── 📄 shipping.ts
├── 📁 utils
│   ├── 📄 address-helper.ts
│   ├── 📄 auth-helper.ts
│   ├── 📄 cn.ts
│   ├── 📄 currency-formatter.ts
│   ├── 📄 data-transform.ts
│   ├── 📄 format-tracking.ts
│   ├── 📄 secure-storage.ts
│   ├── 📄 shipment-helper.ts
│   └── 📄 tracking-helpers.ts
├── ⚙️ .gitignore
├── 📝 GEMINI.md
├── 📝 README.md
├── 📄 bun.lock
├── 📝 changelog.md
├── 📄 eslint.config.mjs
├── 📄 next.config.ts
├── ⚙️ openapi.json
├── ⚙️ package.json
├── 📄 postcss.config.mjs
├── 📄 proxy.ts
└── ⚙️ tsconfig.json
```

---

_Generated by FileTree Pro Extension_
