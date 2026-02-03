# Location Services API Guide

## Overview

The MLS Server now provides a dedicated **Location Services API** to serve hierarchical location data (Countries -> States -> Cities). This API is public and allows frontend applications to populate location dropdowns efficiently without bundling massive JSON datasets.

## Base URL

All requests should be made to:
`[YOUR_API_BASE_URL]/api/locations`

(e.g., `http://localhost:8080/api/locations` or `https://api.yourdomain.com/api/locations`)

## Endpoints

### 1. Get All Countries

Retrieves a list of all countries with their ISO codes.

- **Endpoint**: `GET /countries`
- **Auth**: Public
- **Response**:
  ```json
  [
    {
      "name": "Afghanistan",
      "isoCode": "AF"
    },
    {
      "name": "United States",
      "isoCode": "US"
    }
    // ...
  ]
  ```

### 2. Get States by Country

Retrieves all states/provinces for a specific country. A valid 2-letter ISO Country Code is required.

- **Endpoint**: `GET /countries/:countryCode/states`
- **Params**:
  - `countryCode`: The 2-letter ISO code of the country (e.g., `US`, `PL`, `GB`).
- **Auth**: Public
- **Response**:
  ```json
  [
    {
      "name": "Alabama",
      "isoCode": "AL",
      "countryCode": "US"
    },
    {
      "name": "Connecticut",
      "isoCode": "CT",
      "countryCode": "US"
    }
    // ...
  ]
  ```

### 3. Get Cities by State

Retrieves all cities within a specific state. Both Country and State codes are required.

- **Endpoint**: `GET /countries/:countryCode/states/:stateCode/cities`
- **Params**:
  - `countryCode`: The 2-letter ISO code of the country (e.g., `US`).
  - `stateCode`: The ISO code of the state (e.g., `CT`).
- **Auth**: Public
- **Response**:
  ```json
  [
    {
      "name": "New Haven",
      "countryCode": "US",
      "stateCode": "CT"
    },
    {
      "name": "Hartford",
      "countryCode": "US",
      "stateCode": "CT"
    }
    // ...
  ]
  ```

## Frontend Integration Example (React/JS)

```javascript
const BASE_URL = "https://api.yourdomain.com/api/locations";

// 1. Fetch Countries
async function fetchCountries() {
  const res = await fetch(`${BASE_URL}/countries`);
  const countries = await res.json();
  // Populate Country Dropdown
  return countries;
}

// 2. On Country Select -> Fetch States
async function onCountryChange(countryCode) {
  const res = await fetch(`${BASE_URL}/countries/${countryCode}/states`);
  const states = await res.json();
  // Populate State Dropdown
  return states;
}

// 3. On State Select -> Fetch Cities
async function onStateChange(countryCode, stateCode) {
  const res = await fetch(
    `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
  );
  const cities = await res.json();
  // Populate City Dropdown
  return cities;
}
```

## Error Handling

- **400 Bad Request**: Invalid parameter formats (e.g., `countryCode` not being 2 characters).
- **500 Internal Error**: Server-side processing error.
- **Empty Array `[]`**: Returned if no states/cities are found for the given code.
