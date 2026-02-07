# Client Guide: Phone Verification & Dual Login

This guide explains how to integrate the new phone verification and dual login features into the frontend application.

## 1. Dual Login (Email or Phone)

The login endpoint now accepts either an email address or a phone number as the primary identifier.

**Endpoint**: `POST /auth/login`
**Payload**:

```json
{
  "identifier": "+48123456789", // Can be email or phone
  "password": "yourpassword"
}
```

**Note**: The backend performs an `OR` query. Ensure the `identifier` is sent as a string.

## 2. Updated Registration

Registration now requires a `phone` number. This number will be used for both login and mandatory verification.

**Endpoint**: `POST /auth/register`
**Payload**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+48123456789" // Mandatory
}
```

## 3. Phone Verification Flow

Phone verification is mandatory for creating shipments.

### Step A: Request OTP

Users must be authenticated to request a code for their registered phone number.

**Endpoint**: `POST /auth/send-phone-otp`
**Auth**: Bearer Token required.
**Response**:

```json
{
  "message": "Verification code sent to phone"
}
```

### Step B: Verify OTP

The user enters the 6-digit code received via SMS.

**Endpoint**: `POST /auth/verify-phone-otp`
**Auth**: Bearer Token required.
**Payload**:

```json
{
  "code": "123456"
}
```

**Response**:

```json
{
  "message": "Phone verified successfully"
}
```

## 4. Checking Verification Status

The `user` object returned by `GET /auth/me`, `POST /auth/login`, and `POST /auth/register` now includes:

- `phone`: The user's phone number.
- `is_phone_verified`: `boolean` indicating if the phone is verified.
- `is_verified`: `boolean` indicating if the email is verified (existing field).

**Example User Object**:

```json
{
  "id": "...",
  "email": "...",
  "phone": "+48123456789",
  "is_phone_verified": true,
  "is_verified": true,
  ...
}
```

## 5. Shipment Restrictions

If a user attempts to create a shipment without a verified phone number, the server will return a **403 Forbidden** error.

**Error Response**:

```json
{
  "status": 403,
  "message": "Verification Required",
  "error": "You must verify your phone number before creating a shipment."
}
```

**Recommended Frontend Logic**:

- When receiving a 403 with "Verification Required", redirect the user to a "Verify Phone" screen.
- Only allow the "Create Shipment" button to be active if `user.is_phone_verified` is `true`.

## 6. Twilio Environment (Backend)

The backend uses **Twilio Verify** or standard SMS (depending on config). In development, it uses standard SMS. Ensure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are set in the `.env` file.

## 7. Changing Phone Number

Users can change their registered phone number after signing up using the update profile endpoint.

**Endpoint**: `PATCH /auth/update-user-profile`
**Payload**:

```json
{
  "phone": "+48987654321"
}
```

**Behavior**:

1. If the new `phone` is different from the current one, it must be unique (not taken by another user).
2. The `is_phone_verified` flag will be automatically reset to `false`.
3. The user will be blocked from creating shipments until they verify the new number.

**Verification for New Number**:
After updating, the frontend should prompt the user to follow the standard verification flow:

1. Call `POST /auth/send-phone-otp` (Optional but recommended to trigger SMS).
2. Call `POST /auth/verify-phone-otp` with the new code.
