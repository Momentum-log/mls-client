# Google Places Integration Guide

This guide provides instructions for frontend developers to integrate the new Google Places Autocomplete and Place Details endpoints into the MLS application.

## 1. Authentication

The location endpoints are **semi-authenticated**. You can access them using either a user's session token or a system-wide MLS Key.

### Headers

| Header          | Value                | Description                                                                        |
| :-------------- | :------------------- | :--------------------------------------------------------------------------------- |
| `Authorization` | `Bearer <JWT_TOKEN>` | Use this if the user is already logged in.                                         |
| `X-MLS-Key`     | `<MLS_KEY>`          | Use this for pre-login (guest) access or if authentication is not yet established. |

> [!IMPORTANT]
> Always provide one of these headers. Requests without both will return a `401 Unauthorized` error.

---

## 2. Address Autocomplete

Use this endpoint to provide real-time suggestions as the user types an address.

### Endpoint

`GET /locations/autocomplete`

### Query Parameters

| Parameter      | Type     | Required | Description                                                                                    |
| :------------- | :------- | :------- | :--------------------------------------------------------------------------------------------- |
| `input`        | `string` | **Yes**  | The text search string (e.g., "1600 Amphitheatre").                                            |
| `sessiontoken` | `string` | No       | A unique alphanumeric string to group autocomplete and details calls for billing optimization. |

### Sample Request

```bash
curl -X GET "https://api.momentumlogservices.com/api/locations/autocomplete?input=Warsaw&sessiontoken=unique_token_123" \
     -H "X-MLS-Key: your_mls_key"
```

### Sample Response

```json
[
  {
    "description": "Warsaw, Poland",
    "placeId": "ChIJu94to_9uAEcRdqC-v9uAEcR",
    "mainText": "Warsaw",
    "secondaryText": "Poland"
  },
  {
    "description": "Warsaw, IN, USA",
    "placeId": "ChIJ_f9uAEcRdqC-v9uAEcRdqC-",
    "mainText": "Warsaw",
    "secondaryText": "IN, USA"
  }
]
```

---

## 3. Place Details

Once a user selects a suggestion, use the `placeId` to fetch the full structured address.

### Endpoint

`GET /locations/place-details`

### Query Parameters

| Parameter      | Type     | Required | Description                                                    |
| :------------- | :------- | :------- | :------------------------------------------------------------- |
| `placeId`      | `string` | **Yes**  | The `placeId` returned from the autocomplete suggestion.       |
| `sessiontoken` | `string` | No       | Should match the `sessiontoken` used in the autocomplete call. |

### Sample Request

```bash
curl -X GET "https://api.momentumlogservices.com/api/locations/place-details?placeId=ChIJu94to_9uAEcRdqC-v9uAEcR&sessiontoken=unique_token_123" \
     -H "X-MLS-Key: your_mls_key"
```

### Sample Response

```json
{
  "street": "Plac Defilad 1",
  "city": "Warszawa",
  "state": "Masovian Voivodeship",
  "stateCode": "MZ",
  "country": "Poland",
  "countryCode": "PL",
  "zip": "00-901",
  "formattedAddress": "Plac Defilad 1, 00-901 Warszawa, Poland"
}
```

---

## 4. Best Practices

### Billing Optimization (`sessiontoken`)

To minimize Google API costs, generate a `sessiontoken` (e.g., using `uuid` or a random alphanumeric string) when the user starts typing. Pass this same token to every `autocomplete` request for that specific typing session and to the final `place-details` call.

### Debouncing

Always debounce your autocomplete input (e.g., wait 300ms after the user stops typing) before sending a request to avoid excessive API calls.

### Error Handling

- **401**: Missing or invalid headers.
- **400**: Missing required parameters.
- **502**: Google API error (check server logs).
