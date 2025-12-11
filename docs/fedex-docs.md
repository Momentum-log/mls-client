### Generate Security Token Example

Source: https://developer.fedex.com/api/en-us/get-started

This example demonstrates the format and requirements for generating a security token for FedEx API authentication. The token must meet specific criteria for length and character types.

```text
Example: Y1F6OiVUQW2JPSElmRE9U0IY5
```

--------------------------------

### C# FedEx API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example C# code snippet for making a request to the FedEx API, likely for tracking documents or shipment status. Requires appropriate SDK or HTTP client setup.

```csharp
// C# sample for FedEx API request
// Requires appropriate SDK or HTTP client implementation
// Example: using System.Net.Http;
// using System.Text;
// using System.Threading.Tasks;

// Placeholder for actual implementation
public async Task MakeFedExRequestAsync(string apiUrl, string jsonPayload, string authToken)
{
    using (var client = new HttpClient())
    {
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {authToken}");
        client.DefaultRequestHeaders.Add("Content-Type", "application/json");
        
        var response = await client.PostAsync(apiUrl, new StringContent(jsonPayload, Encoding.UTF8, "application/json"));
        response.EnsureSuccessStatusCode(); // Throws if not 2xx
        
        var responseBody = await response.Content.ReadAsStringAsync();
        // Process responseBody
    }
}
```

--------------------------------

### Create Pickup Request Headers (Example)

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

Example of HTTP headers required for the Create Pickup API request, including content-type, locale, and authorization token.

```http
Content-Type: application/json
x-locale: en_US
Authorization: Bearer YOUR_ACCESS_TOKEN
```

--------------------------------

### Example of Virtualized Response Alert

Source: https://developer.fedex.com/api/en-us/guides/sandboxvirtualization

This section shows an example of an alert that is part of the payload to identify a response returned from the virtualized service.

```JSON
{
  "virtualization_alert": "This is a virtual response."
}
```

--------------------------------

### Create Project - FedEx API

Source: https://developer.fedex.com/api/en-us/get-started

This guide explains how to create a new API project on the FedEx Developer Portal. It involves selecting APIs, configuring project details, and accepting terms and conditions.

```bash
Visit the "My projects" page and open the "APIs" tab.
```

```bash
Click the "Create API Project" button.
```

```bash
Select the API(s) you want to include in your project.
```

```bash
Give your project an identifiable name that is unique to your organization.
```

```bash
Accept the terms, including the FedEx Developer Portal License Agreement.
```

```bash
Click the Create button to view your test credentials.
```

--------------------------------

### RUST FedEx API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example Rust code snippet for making HTTP requests to the FedEx API, likely using a crate like 'reqwest'.

```rust
// Rust sample for FedEx API request using 'reqwest' crate
// Add `reqwest = { version = "0.11", features = ["json"] }` to Cargo.toml

/*
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use serde_json::json;

async fn make_fedex_request(api_url: &str, json_payload: serde_json::Value, auth_token: &str) -> Result<serde_json::Value, reqwest::Error> {
    let client = reqwest::Client::new();
    
    let response = client.post(api_url)
        .header(AUTHORIZATION, format!("Bearer {}", auth_token))
        .header(CONTENT_TYPE, "application/json")
        .json(&json_payload)
        .send()
        .await?;

    // Check for successful status code
    if response.status().is_success() {
        response.json::<serde_json::Value>().await
    } else {
        // Handle error response
        let status = response.status();
        let error_text = response.text().await?;
        Err(reqwest::Error::from(std::io::Error::new(std::io::ErrorKind::Other, format!("API Error: {} - {}", status, error_text))))
    }
}

// Example usage:
// #[tokio::main]
// async fn main() {
//     let api_url = "https://apis.fedex.com/track/v1/trackingdocuments";
//     let payload = json!({ ... your payload ... });
//     let token = "YOUR_AUTH_TOKEN";
//     match make_fedex_request(api_url, payload, token).await {
//         Ok(data) => println!("Response: {:?}", data),
//         Err(e) => eprintln!("Error: {}", e),
//     }
// }
*/
// Placeholder for actual implementation
```

--------------------------------

### PYTHON FedEx API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example Python code snippet for making requests to the FedEx API using the 'requests' library.

```python
# Python sample for FedEx API request using 'requests' library

import requests
import json

def make_fedex_request(api_url, json_payload, auth_token):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {auth_token}'
    }
    
    try:
        response = requests.post(api_url, headers=headers, data=json.dumps(json_payload))
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making FedEx API request: {e}")
        return None

# Example usage:
# api_endpoint = "https://apis.fedex.com/track/v1/trackingdocuments"
# payload = { ... your payload ... }
# token = "YOUR_AUTH_TOKEN"
# result = make_fedex_request(api_endpoint, payload, token)
# if result:
#     print(result)
```

--------------------------------

### JAVASCRIPT FedEx API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JavaScript code snippet for making requests to the FedEx API using the Fetch API or a library like Axios.

```javascript
// JavaScript sample for FedEx API request using Fetch API

async function makeFedExRequest(apiUrl, jsonPayload, authToken) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(jsonPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    // Process responseData
    return responseData;
  } catch (error) {
    console.error('Error making FedEx API request:', error);
  }
}
```

--------------------------------

### SWIFT FedEx API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example Swift code snippet for making HTTP requests to the FedEx API, typically using URLSession.

```swift
// Swift sample for FedEx API request using URLSession

import Foundation

func makeFedExRequest(apiUrl: String, jsonPayload: [String: Any], authToken: String, completion: @escaping (Result<Data, Error>) -> Void) {
    guard let url = URL(string: apiUrl) else { 
        completion(.failure(NSError(domain: "com.fedex.api", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])))
        return
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")

    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: jsonPayload, options: [])
    } catch {
        completion(.failure(error))
        return
    }

    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            completion(.failure(NSError(domain: "com.fedex.api", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Invalid Response"])))
            return
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let statusCodeError = NSError(domain: "com.fedex.api", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: "API Error: (httpResponse.statusCode)"])
            completion(.failure(statusCodeError))
            return
        }

        guard let data = data else {
            completion(.failure(NSError(domain: "com.fedex.api", code: 1003, userInfo: [NSLocalizedDescriptionKey: "No Data Received"])))
            return
        }

        completion(.success(data))
    }
    task.resume()
}

// Example usage:
// let apiUrl = "https://apis.fedex.com/track/v1/trackingdocuments"
// let payload: [String: Any] = [ ... your payload ... ]
// let token = "YOUR_AUTH_TOKEN"
// makeFedExRequest(apiUrl: apiUrl, jsonPayload: payload, authToken: token) { result in
//     switch result {
//     case .success(let data):
//         if let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
//             print(json)
//         }
//     case .failure(let error):
//         print("Error: \(error.localizedDescription)")
//     }
// }
```

--------------------------------

### JAVA FedEx API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example Java code snippet for interacting with the FedEx API. This would typically involve using an HTTP client library like Apache HttpClient or OkHttp.

```java
// Java sample for FedEx API request
// Requires HTTP client library (e.g., Apache HttpClient, OkHttp)

/*
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class FedExApiCaller {
    public void makeFedExRequest(String apiUrl, String jsonPayload, String authToken) throws Exception {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(apiUrl);
            request.setHeader("Authorization", "Bearer " + authToken);
            request.setHeader("Content-Type", "application/json");
            
            StringEntity entity = new StringEntity(jsonPayload);
            request.setEntity(entity);
            
            var response = httpClient.execute(request);
            // Process response
            var responseBody = EntityUtils.toString(response.getEntity());
            // Handle responseBody
        }
    }
}
*/
// Placeholder for actual implementation
```

--------------------------------

### PHP FedEx API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example PHP code snippet for interacting with the FedEx API, typically using cURL to handle HTTP requests.

```php
// PHP sample for FedEx API request using cURL

function makeFedExRequest($apiUrl, $jsonPayload, $authToken) {
    $ch = curl_init($apiUrl);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $authToken
    ));

    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        // Handle error
        $error_msg = curl_error($ch);
        curl_close($ch);
        throw new Exception("cURL Error: " . $error_msg);
    }

    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Process response based on $http_code and $response
    if ($http_code >= 200 && $http_code < 300) {
        return json_decode($response, true);
    } else {
        // Handle non-2xx response
        throw new Exception("API Error: " . $response);
    }
}
```

--------------------------------

### Check Pickup Availability - C# Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

C# code example demonstrating how to make a request to the FedEx API to check pickup availability. This snippet likely uses a library to handle HTTP requests and JSON serialization.

```csharp
// C# code example for FedEx API pickup availability check would go here.
// This would typically involve using HttpClient and System.Text.Json or Newtonsoft.Json.
```

--------------------------------

### Create Organization - FedEx API

Source: https://developer.fedex.com/api/en-us/get-started

This guide outlines the steps to create a new organization within the FedEx Developer Portal. It requires providing company information, adding and authenticating a FedEx account, and accepting terms.

```bash
Click on "Create Organization" in the left-hand navigation.
```

```bash
Provide your company name, website URL and business email for verification.
```

```bash
Create an organization name.
```

```bash
Enter the location information where your company is based.
```

```bash
Enter your existing FedEx account number, account nickname, and billing address.
```

```bash
Accept the Developer Agreement and the Program Manual(s).
```

```bash
Click "Manage Organization" in the left-hand navigation to view or edit details.
```

```bash
Open the "Users" tab and click the "Add Users" button.
```

```bash
Select a user role: Viewer, Contributor or Admin.
```

```bash
Assign a project to the user.
```

```bash
Enter the email addresses of the users you want to join your organization.
```

--------------------------------

### Track by Tracking Number Request Payload Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JSON payload for tracking a package using a tracking number. Includes options for detailed scans and tracking information with ship dates.

```json
{
  "includeDetailedScans": true,
  "trackingInfo": [
    {
      "shipDateBegin": "2020-03-29",
      "shipDateEnd": "2020-04-01",
      "trackingNumberInfo": {
        "trackingNumber": "128667043726",
        "carrierCode": "FDXE",
        "trackingNumberUniqueId": "245822~123456789012~FDEG"
      }
    }
  ]
}
```

--------------------------------

### FedEx Tracking Number Subscription API Documentation

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/tracking-number-subscription

This section provides documentation for the FedEx Tracking Number Subscription API. It guides users on how to manage shipments, link accounts, and receive real-time tracking updates using Advanced Integrated Visibility APIs. It also mentions the use of OAuth and project setup guidance for adding tracking numbers to a webhook.

```English
Easily manage your shipments—link accounts, track updates, and stay informed in real time with Advanced Integrated Visibility APIs.
**CLICK TO LEARN MORE**
```

--------------------------------

### FedEx Location Data Example

Source: https://developer.fedex.com/api/en-us/catalog/locations/v1/docs

This snippet demonstrates a comprehensive example of the JSON response for a FedEx location, including its type, attributes, package limitations, and service capabilities.

```JSON
{
    "locationType": "FEDEX_AUTHORIZED_SHIP_CENTER",
    "locationAttributeTypes": [
        "ACCEPTS_CASH",
        "COPY_AND_PRINT_SERVICES"
    ],
    "lockerAvailability": false,
    "packageMaximumLimits": {
        "weight": {
            "units": "KG",
            "value": 68
        },
        "dimensions": {
            "length": 2,
            "width": 4,
            "units": "IN",
            "height": 7
        }
    },
    "specialInstructions": "Store email: Packagingdeput@telus.net",
    "rthservice": "REDIRECT",
    "locationCapabilities": [
        {
            "serviceType": "PRIORITY_OVERNIGHT",
            "transferOfPossessionType": "DROP_OFF",
            "carrierCode": "FDXE",
            "daysOfWeek": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY"
            ],
            "serviceCategory": "GROUND_HOME_DELIVERY"
        },
        {
            "serviceType": "FEDEX_GROUND",
            "transferOfPossessionType": "HOLD_AT_LOCATION",
            "carrierCode": "FDXG",
            "daysOfWeek": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY"
            ],
            "serviceCategory": "GROUND"
        }
    ],
    "ambiguousLocationsReturned": false,
    "nearestLocationReturned": false,
    "latestLocationReturned": false,
    "lockerAvailabilityCode": 25,
    "lockerAvailabilityMessage": "Locker availability lookup is not available. Note: this is decouple state.",
    "location": {
        "address": {
            "streetLines": [
                "10 FedEx Parkway",
                "Suite 302"
            ],
            "city": "Beverly Hills",
            "stateOrProvinceCode": "CA",
            "postalCode": "90210",
            "countryCode": "US",
            "residential": false
        },
        "longLat": {
            "latitude": 5.637376,
            "longitude": 3.61607
        }
    },
    "phoneNumber": "9015551234",
    "multipleMatchesAction": "RETURN_ALL",
    "sort": {
        "criteria": "DISTANCE",
        "order": "ASCENDING"
    },
    "trackingInfo": {
        "uniqueTrackingId": "789645",
        "trackingNumber": "123456789012",
        "shipDate": "2019-10-13"
    },
    "sameState": true,
    "sameCountry": true,
    "redirectToHoldType": "FEDEX_GROUND",
    "locationAttrTypes": [
        "ACCEPTS_CASH",
        "PACK_AND_SHIP"
    ],
    "locationCapabilities": [
        {
            "carrierCode": "FDXE",
            "serviceType": "PRIORITY_OVERNIGHT",
            "transferOfPossessionType": "DROPOFF",
            "serviceCategory": "EXPRESS_FREIGHT",
            "daysOfWeek": [
                "MON",
                "TUE"
            ]
        }
    ],
    "packageMaximumLimits": [
        {
            "weight": {
                "units": "LB",
                "value": 150
            },
            "dimensions": {
                "length": 20,
                "width": 40,
                "units": "IN",
                "height": 70
            }
        }
    ],
    "locationTypes": [
        "FEDEX_AUTHORIZED_SHIP_CENTER"
    ],
    "includeHoliday": true,
    "dropoffTime": "09:30:00",
    "dropOffServiceType": "GROUND",
    "searchBy": "searchBy",
    "contentOptions": "HOLIDAYS",
    "carrierCodes": [
        "FDXE"
    ],
    "getCall": false
}
```

--------------------------------

### Check Pickup Availability - SWIFT Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

Swift code example for checking pickup availability with the FedEx API. This snippet would likely use `URLSession` for network requests and `Codable` for JSON handling.

```swift
// Swift code example for FedEx API pickup availability check would go here.
// This would typically involve using URLSession and Codable.
```

--------------------------------

### Track Document Response Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JSON response for a successful tracking document request, including transaction IDs, output details like document type, format, content, and alerts.

```json
{
  "transactionId": "624deea6-b709-470c-8c39-4b5511281492",
  "customerTransactionId": "AnyCo_order123456789",
  "output": {
    "localization": {
      "languageCode": "en",
      "localeCode": "US"
    },
    "documentType": "string",
    "documentFormat": "PNG",
    "document": [
      "string"
    ],
    "alerts": "TRACKING.DATA.NOTFOUND - Tracking data unavailable"
  }
}
```

--------------------------------

### Webhook Setup and Use Cases

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/introduction/introduction-advanced-integrated-visibility

This section details the process of setting up FedEx webhooks and outlines different use cases based on whether Signature Proof of Delivery (SPOD) or Picture Proof of Delivery (PPOD) is selected. It explains the data received for various tracking events and scenarios.

```Markdown
### Introduction to Advanced Integrated Visibility  

  
Advanced Integrated Visibility webhooks is a software architecture method to automate push notifications that occur between sender and receiver applications whenever a new event happens.
Advanced Integrated Visibility webhooks is described as a user-defined HTTPS callbacks (typically POST request) triggered by change in status of a specific event. It sends near real-time automated notifications (messages/information/data) from sender (server-side) application to receiver (client-side) application based on the "Event Reaction" concept (i.e., don’t contact me, I will only contact you if I have something new for you).
### API vs Advanced Integrated Visibility __ Workflow  

  
Below pictorial representation describes how the event data is received in case of API request and with the Advanced Integrated Visibility webhook .
###   
Use cases for Signature Proof of Delivery (SPOD) and Picture Proof of Delivery (PPOD)  

| Tracking Event | SPOD/PPOD | Result  
---|---|---|---
Use Case 1 | Delivery | Selected | You will receive two delivery timestamps:
  * One delivery timestamp for the Delivery tracking event.
  * Another delivery timestamp along with the SPOD/PPOD image byte array for the SPOD/PPOD event notification.

_**Note :**_
  * _You will receive two delivery timestamp details, but the delivery timestamp value will be the same in both, and it is the time when the package is delivered._
  * _The SPOD/PPOD image will be received some time after the package delivery event._
  * _You will receive Advanced Integrated Visibility webhook notifications for any delivery of packages with and without SPOD/PPOD also._

  
Use Case 1.1 | Delivery | Not Selected | You will receive only the “Delivery” event timestamp when the package is delivered.
  * You will receive Advanced Integrated Visibility webhook notifications for any delivery timestamp of packages with and without SPOD/PPOD also.
  * You will not receive SPOD/PPOD notifications of the packages with signature or picture proof

  
Use Case 2 | Ship/In-Transit/Exceptions | Selected | You will receive only one delivery timestamp for the SPOD/PPOD event, which will contain the delivery timestamp along with the SPOD/PPOD image byte array. If SPOD/PPOD is not selected, then you will not receive any delivery timestamp information. _**Note :**_
  * _In payload, you will receive delivery timestamp of the package(s) that have Signature or picture only._
  * _You will not receive any Advanced Integrated Visibility notifications for any delivery (delivery timestamp or delivery scan event) of the packages that do not have SPOD/PPOD._

  
Use Case 2.1 | Ship/In-Transit/Exceptions | Not Selected | You will not receive any delivery timestamp information. _**Note:** You will not receive Advanced Integrated Visibility notifications for any delivery of packages with and without SPOD/PPOD also._  
###   
Additional Information:  

  * To learn more about the production keys (API and secret key), refer to API Authorization documentation page.
  * To learn more about how to get started with FedEx APIs, refer the Getting Started guide .
  * To learn more about FedEx project roles, refer the Organization Administration Guide.
  * To learn more about pricing refer to Advanced Integrated Visibility Overview .
```

--------------------------------

### Check Pickup Availability - JAVA Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

Java code example for interacting with the FedEx API to check pickup availability. This snippet would typically use libraries like Apache HttpClient or OkHttp for requests and Jackson or Gson for JSON processing.

```java
// Java code example for FedEx API pickup availability check would go here.
// This would typically involve using HttpClient and libraries like Jackson or Gson for JSON.
```

--------------------------------

### Check Pickup Availability - PYTHON Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

Python code example for querying FedEx pickup availability. This snippet would typically use the `requests` library to send a POST request with a JSON payload to the API endpoint.

```python
# Python code example for FedEx API pickup availability check would go here.
# This would typically involve using the 'requests' library.
```

--------------------------------

### FedEx API Authorization - RUST Request Sample

Source: https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs

Example of how to construct and send an API authorization request using RUST. This code demonstrates setting up the request with the necessary parameters.

```RUST
// RUST code example for API Authorization request would go here.
```

--------------------------------

### FedEx API Authorization - C# Request Sample

Source: https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs

Example of how to construct and send an API authorization request using C#. This code demonstrates setting up the request with the necessary parameters.

```C#
// C# code example for API Authorization request would go here.
```

--------------------------------

### Check Pickup Availability - RUST Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

Rust code example for making a request to the FedEx API to check pickup availability. This snippet would likely use crates like `reqwest` for HTTP requests and `serde_json` for JSON serialization/deserialization.

```rust
// Rust code example for FedEx API pickup availability check would go here.
// This would typically involve using crates like 'reqwest' and 'serde_json'.
```

--------------------------------

### FedEx API Rate and Transit Times Request Payload

Source: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs

This is a full schema example of a request payload for the FedEx API to get rate and transit time information. It includes details about the account, shipment, package, and service options.

```JSON
{
  "accountNumber": {
    "value": "Your account number"
  },
  "rateRequestControlParameters": {
    "returnTransitTimes": false,
    "servicesNeededOnRateFailure": true,
    "variableOptions": "FREIGHT_GUARANTEE",
    "rateSortOrder": "SERVICENAMETRADITIONAL"
  },
  "requestedShipment": {
    "shipper": {
      "address": {
        "streetLines": [
          "1550 Union Blvd",
          "Suite 302"
        ],
        "city": "Beverly Hills",
        "stateOrProvinceCode": "TN",
        "postalCode": "65247",
        "countryCode": "US",
        "residential": false
      }
    },
    "recipient": {
      "address": {
        "streetLines": [
          "1550 Union Blvd",
          "Suite 302"
        ],
        "city": "Beverly Hills",
        "stateOrProvinceCode": "TN",
        "postalCode": "65247",
        "countryCode": "US",
        "residential": false
      }
    },
    "serviceType": "STANDARD_OVERNIGHT",
    "preferredCurrency": "USD",
    "rateRequestType": [
      "ACCOUNT",
      "LIST"
    ],
    "shipDateStamp": "2019-09-05",
    "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
    "requestedPackageLineItems": [
      {
        "subPackagingType": "BAG",
        "groupPackageCount": 1,
        "declaredValue": {
          "amount": "100",
          "currency": "USD"
        },
        "weight": {
          "units": "LB",
          "value": 22
        },
        "dimensions": {
          "length": 10,
          "width": 8,
          "height": 2,
          "units": "IN"
        },
        "variableHandlingChargeDetail": {
          "rateType": "ACCOUNT",
          "percentValue": 0,
          "rateLevelType": "BUNDLED_RATE",
          "fixedValue": {
            "amount": "100",
            "currency": "USD"
          },
          "rateElementBasis": "NET_CHARGE"
        },
        "packageSpecialServices": {
          "specialServiceTypes": [
            "DANGEROUS_GOODS"
          ],
          "signatureOptionType": [
            "NO_SIGNATURE_REQUIRED"
          ],
          "alcoholDetail": {
            "alcoholRecipientType": "LICENSEE",
            "shipperAgreementType": "Retailer"
          },
          "dangerousGoodsDetail": {
            "accessibility": "ACCESSIBLE",
            "options": [
              "BATTERY"
            ],
            "containers": [
              {
                "offeror": "Offeror Name",
                "hazardousCommodities": [
                  {
                    "quantity": {
                      "quantityType": "GROSS",
                      "amount": 0,
                      "units": "LB"
                    },
                    "innerReceptacles": [
                      {
                        "quantity": {
                          "quantityType": "GROSS",
                          "amount": 0,
                          "units": "LB"
                        }
                      }
                    ],
                    "options": {
                      "labelTextOption": "Override",
                      "customerSuppliedLabelText": "LabelText"
                    },
                    "description": {
                      "sequenceNumber": 0,
                      "processingOptions": [
                        "INCLUDE_SPECIAL_PROVISIONS"
                      ],
                      "subsidiaryClasses": "subsidiaryClass",
                      "labelText": "labelText",
                      "technicalName": "technicalName",
                      "packingDetails": {
                        "packingInstructions": "instruction",
                        "cargoAircraftOnly": false
                      },
                      "authorization": "Authorization Information",
                      "reportableQuantity": false,
                      "percentage": 10,
                      "id": "ID",
                      "packingGroup": "DEFAULT",
                      "properShippingName": "ShippingName",
                      "hazardClass": "hazardClass"
                    }
                  }
                ],
                "numberOfContainers": 10,
                "containerType": "Copper Box",
                "emergencyContactNumber": {
                  "areaCode": "202",
                  "extension": "3245",
                  "countryCode": "US",
                  "personalIdentificationNumber": "9545678",
                  "localNumber": "23456"
                },
                "packaging": {
                  "count": 20,
                  "units": "Liter"
                },
                "packingType": "ALL_PACKED_IN_ONE",
                "radioactiveContainerClass": "EXCEPTED_PACKAGE"
              }
            ],
            "regulation": "ADR"
          },
          "packageCODDetail": {
            "codCollectionAmount": {
              "amount": 12.45,
              "currency": "USD"
            }
          }
        }
      }
    ]
  }
}
```

--------------------------------

### Create Webhook for Shipment Tracking

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/account-number-subscription

Guides users on creating a webhook project to receive near real-time tracking updates for FedEx packages. It outlines the initial step of specifying the reason for webhook access.

```Text
I work for a company that:
Select an Option
You must select an option.
  * Ships with FedEx and needs to integrate FedEx APIs into their system
  * Sells or provides a software solution that uses FedEx technology and is not a certified FedEx Compatible provider
  * Is a certified FedEx Compatible provider

NEXT   
CANCEL
```

--------------------------------

### FedEx API Authorization - JAVASCRIPT Request Sample

Source: https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs

Example of how to construct and send an API authorization request using JAVASCRIPT. This code demonstrates setting up the request with the necessary parameters.

```JAVASCRIPT
// JAVASCRIPT code example for API Authorization request would go here.
```

--------------------------------

### Join Organization - FedEx API

Source: https://developer.fedex.com/api/en-us/get-started

This section details the process for joining an existing organization on the FedEx Developer Portal. It involves receiving an invitation from an organization admin and accepting it within a specified timeframe.

```bash
Ask the admin of your organization to send you an invite.
```

```bash
Accept the invite by logging in with your existing user ID and password or creating a new one.
```

--------------------------------

### FedEx Add Tracking Number to Webhook Guide

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/tracking-number-subscription

This guide explains the process of adding tracking numbers to a webhook using the Tracking Number Subscription API. It includes information on OAuth and project setup for integrating tracking numbers.

```English
Add tracking numbers to your webhook using the Tracking Number Subscription API with OAuth and project setup guidance.
**CLICK TO LEARN MORE**
```

--------------------------------

### Track Document Request Payload Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JSON payload for requesting tracking documents, specifying document type, format, and tracking details including tracking number, carrier code, and ship dates.

```json
{
  "trackDocumentDetail": {
    "documentType": "SIGNATURE_PROOF_OF_DELIVERY",
    "documentFormat": "PNG"
  },
  "trackDocumentSpecification": [
    {
      "trackingNumberInfo": {
        "trackingNumber": "128667043726",
        "carrierCode": "FDXE",
        "trackingNumberUniqueId": "245822~123456789012~FDEG"
      },
      "shipDateBegin": "2020-03-29",
      "shipDateEnd": "2020-04-01",
      "accountNumber": "XXX61073"
    }
  ]
}
```

--------------------------------

### Java HMAC SHA256 Implementation

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/introduction/business-rules-and-best-practices

A Java code example demonstrating the implementation of HMAC SHA256 hashing. It shows how to initialize the MAC with a secret key and perform the hashing operation on the payload.

```Java
Mac mac = Mac.getInstance("HmacSHA256");   

mac.init(new SecretKeySpec(secureToken.getBytes(), "HmacSHA256"));   

return new String(Base 64 encoded(mac.doFinal(payLoad.getBytes())));
```

--------------------------------

### FedEx API Authorization - JAVA Request Sample

Source: https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs

Example of how to construct and send an API authorization request using JAVA. This code demonstrates setting up the request with the necessary parameters.

```JAVA
// JAVA code example for API Authorization request would go here.
```

--------------------------------

### Send Shipment Notification Request (Swift)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Swift code example for sending a shipment notification using the FedEx API. Shows how to prepare the request.

```swift
// Swift code example for sending shipment notification would go here.
// This would typically involve using URLSession to make a POST request
// to the FedEx API endpoint with the JSON payload.
```

--------------------------------

### Track by References Request Payload Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JSON payload for tracking a FedEx shipment using references. It includes reference details like type, value, account number, carrier code, ship date range, and destination information, along with an option to include detailed scans.

```json
{
  "referencesInformation": {
    "type": "BILL_OF_LADING",
    "value": "56754674567546754",
    "accountNumber": "XXX61073",
    "carrierCode": "FDXE",
    "shipDateBegin": "2019-02-13",
    "shipDateEnd": "2019-02-13",
    "destinationCountryCode": "US",
    "destinationPostalCode": "75063"
  },
  "includeDetailedScans": "true"
}
```

--------------------------------

### FedEx API Authorization - PHP Request Sample

Source: https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs

Example of how to construct and send an API authorization request using PHP. This code demonstrates setting up the request with the necessary parameters.

```PHP
// PHP code example for API Authorization request would go here.
```

--------------------------------

### FedEx API Authorization - PYTHON Request Sample

Source: https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs

Example of how to construct and send an API authorization request using PYTHON. This code demonstrates setting up the request with the necessary parameters.

```PYTHON
# PYTHON code example for API Authorization request would go here.
```

--------------------------------

### FedEx API URI Versioning Example

Source: https://developer.fedex.com/api/en-us/guides/versioning

Demonstrates the URI structure for accessing a specific version of the FedEx Ship API, including only the major version number.

```URI
/ship/v1/shipments
```

--------------------------------

### Send Shipment Notification Request (Rust)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Rust code example for sending a shipment notification using the FedEx API. Demonstrates API request construction.

```rust
// Rust code example for sending shipment notification would go here.
// This would typically involve using libraries like 'reqwest' to make a POST request
// to the FedEx API endpoint with the JSON payload.
```

--------------------------------

### Check Pickup Availability - JAVASCRIPT Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

JavaScript code example for making a request to the FedEx API to check pickup availability. This snippet would likely use the `fetch` API or a library like Axios to send a POST request with a JSON payload.

```javascript
// JavaScript code example for FedEx API pickup availability check would go here.
// This would typically involve using fetch or libraries like Axios.
```

--------------------------------

### FedEx Shipper - Tracking Number Subscription Guide

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/tracking-number-subscription

Learn about the Shipper's Tracking Number Subscription process to receive secure, real-time FedEx tracking updates via Advanced Integrated Visibility. This guide is for shippers who need to integrate FedEx tracking into their systems.

```English
Learn about Tracking number subscription – shipper to get secure, real-time FedEx tracking updates via Advanced Integrated Visibility
**CLICK TO LEARN MORE**
```

--------------------------------

### Send Shipment Notification Request (Python)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Python code example for sending a shipment notification using the FedEx API. Shows how to structure the request.

```python
# Python code example for sending shipment notification would go here.
# This would typically involve using the 'requests' library to make a POST request
# to the FedEx API endpoint with the JSON payload.
```

--------------------------------

### FedEx Create Pickup Response Samples

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

These JSON examples illustrate successful and error responses from the FedEx 'Create Pickup' API. They cover various HTTP status codes, including success (200) with confirmation details and common client/server errors (4xx, 5xx).

```JSON
{
  "transactionId": "624deea6-b709-470c-8c39-4b5511281492",
  "customerTransactionId": "AnyCo_order123456789",
  "output": {
    "pickupConfirmationCode": "3001",
    "message": "Courier on the way",
    "location": "COSA",
    "alerts": [
      {
        "code": "SHIP.RECIPIENT.POSTALCITY.MISMATCH",
        "alertType": "NOTE",
        "message": "Recipient Postal-City Mismatch."
      }
    ]
  }
}
```

--------------------------------

### FedEx Rate API - Service Type Example

Source: https://developer.fedex.com/api/en-us/guides/best-practices

This example demonstrates how to specify a service type when requesting a rate quote from the FedEx API. By filtering by a specific serviceType, the response size is reduced and transaction response time is improved.

```text
Example: STANDARD_OVERNIGHT
```

--------------------------------

### Send Shipment Notification Request (C#)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

C# code example for sending a shipment notification using the FedEx API. Demonstrates constructing the request payload.

```csharp
// C# code example for sending shipment notification would go here.
// This would typically involve using HttpClient to make a POST request
// to the FedEx API endpoint with the JSON payload.
```

--------------------------------

### FedEx Package Scanned at Ship N Get

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

An FDEG (FedEx Ground) package has been scanned by a customer at a FedEx Ship N Get location.

```text
FDEG - Package scanned at FedEx Ship N Get by customer
```

--------------------------------

### HMAC SHA256 Hashing Example

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/introduction/business-rules-and-best-practices

This snippet illustrates the pseudocode for generating an HMAC SHA256 hash. It involves initializing the MAC with the HmacSHA256 algorithm and a security token, then finalizing the hash with the payload.

```pseudocode
SHA256( security token + payload) = Base 64 encoded fdx-signature as part of payload Header
```

```pseudocode
First, initialize MAC using HmacSHA256 algorithm and the security token as the secret key.
Then, finalize the MAC operation by hex encoding the request payload sent by FedEx.
This final hash should match with the value of the header fdx-signature in the PUSH sent by FedEx.
```

--------------------------------

### Check Pickup Availability - PHP Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

PHP code example for checking pickup availability via the FedEx API. This snippet would likely use cURL or a Guzzle HTTP client to send the POST request with the JSON payload.

```php
// PHP code example for FedEx API pickup availability check would go here.
// This would typically involve using cURL or a library like Guzzle.
```

--------------------------------

### Get Quick Rate Quote and Transit Times

Source: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs

Retrieve quick rate quotes and transit times without needing to enter detailed package descriptions. This feature simplifies the process of getting basic shipping estimates.

```API
POST /rate

Request Body:
{
  "accountNumber": "YOUR_ACCOUNT_NUMBER",
  "origin": {
    "postalCode": "90210",
    "countryCode": "US"
  },
  "destination": {
    "postalCode": "10001",
    "countryCode": "US"
  },
  "package": {
    "weight": {
      "value": 5,
      "units": "LB"
    },
    "dimensions": {
      "length": 10,
      "width": 8,
      "height": 6,
      "units": "IN"
    }
  },
  "serviceType": "FEDEX_GROUND"
}
```

--------------------------------

### FedEx API - Estimated Delivery Time Window

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Provides an estimated time window for package delivery, including a description and the specific start and end times.

```json
{
  "description": "Description field",
  "window": {
    "begins": "2021-10-01T08:00:00",
    "ends": "2021-10-15T00:00:00-06:00"
  }
}
```

--------------------------------

### Track by TCN Request Payload Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JSON payload for tracking a shipment using a Tracking Control Number (TCN). This payload includes TCN details like value, carrier code, and ship dates, along with an option to include detailed scans.

```json
{
  "tcnInfo": {
    "value": "N552428361Y555XXX",
    "carrierCode": "FDXE",
    "shipDateBegin": "2019-02-13",
    "shipDateEnd": "2019-02-13"
  },
  "includeDetailedScans": true
}
```

--------------------------------

### FedEx API - Estimated Delivery Time Window

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Provides an estimated time window for package delivery, including a description and the specific start and end times.

```json
{
  "description": "Description field",
  "window": {
    "begins": "2021-10-01T08:00:00",
    "ends": "2021-10-15T00:00:00-06:00"
  }
}
```

--------------------------------

### Create Pickup Request (JSON)

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

Example of a JSON request body to create a pickup request for FedEx Ground. It includes essential details like account number, origin address, package count, carrier code, and total weight.

```json
{
  "accountNumber": {
    "value": "YOUR_ACCOUNT_NUMBER"
  },
  "originDetail": {
    "pickupLocation": {
      "address": {
        "streetLines": [
          "100 FedEx Parkway"
        ],
        "city": "Memphis",
        "stateOrProvinceCode": "TN",
        "postalCode": "38116",
        "countryCode": "US"
      }
    }
  },
  "packageCount": 1,
  "carrierCode": "FDXG",
  "totalWeight": {
    "units": "LB",
    "value": 10
  },
  "pickupType": "REGULAR_STOP"
}
```

--------------------------------

### Send Shipment Notification Request (Java)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Java code example for sending a shipment notification using the FedEx API. Shows how to build the request object.

```java
// Java code example for sending shipment notification would go here.
// This would typically involve using libraries like Apache HttpClient or OkHttp
// to send a POST request with the JSON payload.
```

--------------------------------

### FedEx CSP - Tracking Number Subscription Guide

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/tracking-number-subscription

This guide explains the CSP's Tracking Number Subscription for obtaining secure, real-time FedEx tracking updates through Advanced Integrated Visibility. It is intended for software solution providers using FedEx technology.

```English
Learn about Tracking number subscription – CSP to get secure, real-time FedEx tracking updates via Advanced Integrated Visibility
**CLICK TO LEARN MORE**
```

--------------------------------

### Send Shipment Notification Request (JavaScript)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

JavaScript code example for sending a shipment notification using the FedEx API. Demonstrates making an API call.

```javascript
// JavaScript code example for sending shipment notification would go here.
// This would typically involve using fetch or XMLHttpRequest to make a POST request
// to the FedEx API endpoint with the JSON payload.
```

--------------------------------

### Send Shipment Notification Request (PHP)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

PHP code example for sending a shipment notification using the FedEx API. Illustrates how to prepare and send the request.

```php
// PHP code example for sending shipment notification would go here.
// This would typically involve using cURL or file_get_contents with stream context
// to send a POST request to the FedEx API endpoint with the JSON payload.
```

--------------------------------

### Track by Transportation Control Number (TCN) - FedEx API Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This example demonstrates how to track government orders using a Transportation Control Number (TCN) through the FedEx API. Ensure the TCN is entered without preceding spaces or 'TCN.'

```JSON
{
  "TrackRequest": {
    "WebAuthenticationDetail": {
      "UserCredential": {
        "Key": "YOUR_FEDEX_API_KEY",
        "Password": "YOUR_FEDEX_API_PASSWORD"
      }
    },
    "ClientDetail": {
      "AccountNumber": "YOUR_FEDEX_ACCOUNT_NUMBER",
      "MeterNumber": "YOUR_FEDEX_METER_NUMBER"
    },
    "Version": {
      "ServiceVersion": "10.0",
      "CarrierCode": "FDXE"
    },
    "TrackingInfo": {
      "TrackingNumber": "YOUR_TCN_NUMBER"
    }
  }
}
```

--------------------------------

### Track by Door Tag Number - FedEx API Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This example shows how to track a shipment using a FedEx Door Tag number through the FedEx API. Door tag numbers are typically used when a delivery attempt was made but the recipient was unavailable.

```JSON
{
  "TrackRequest": {
    "WebAuthenticationDetail": {
      "UserCredential": {
        "Key": "YOUR_FEDEX_API_KEY",
        "Password": "YOUR_FEDEX_API_PASSWORD"
      }
    },
    "ClientDetail": {
      "AccountNumber": "YOUR_FEDEX_ACCOUNT_NUMBER",
      "MeterNumber": "YOUR_FEDEX_METER_NUMBER"
    },
    "Version": {
      "ServiceVersion": "10.0",
      "CarrierCode": "FDXE"
    },
    "TrackingInfo": {
      "TrackingNumber": "DT123456789012"
    }
  }
}
```

--------------------------------

### FedEx API Special Service Options Request Example

Source: https://developer.fedex.com/api/en-us/catalog/service-availability/v1/docs

This snippet demonstrates a typical request to the FedEx API for special service options. It includes common headers and a sample request body structure.

```HTTP
POST /availability/v1/specialserviceoptions HTTP/1.1
Host: apis-sandbox.fedex.com
Content-Type: application/json
X-Customer-Transaction-Id: 624deea6-b709-470c-8c39-4b5511281492
X-Locale: en_US
Authorization: Bearer XXX

{
  "requestedShipment": {
    "accountNumber": {
      "value": "YOUR_ACCOUNT_NUMBER"
    },
    "carrierCodes": [
      "FDXG",
      "FDXE"
    ]
  }
}
```

--------------------------------

### Track by Reference - FedEx API Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This snippet illustrates tracking a shipment using a reference number (e.g., PO number, invoice number) via the FedEx API. This method is useful when a standard tracking number is not readily available.

```JSON
{
  "TrackRequest": {
    "WebAuthenticationDetail": {
      "UserCredential": {
        "Key": "YOUR_FEDEX_API_KEY",
        "Password": "YOUR_FEDEX_API_PASSWORD"
      }
    },
    "ClientDetail": {
      "AccountNumber": "YOUR_FEDEX_ACCOUNT_NUMBER",
      "MeterNumber": "YOUR_FEDEX_METER_NUMBER"
    },
    "Version": {
      "ServiceVersion": "10.0",
      "CarrierCode": "FDXE"
    },
    "TrackingInfo": {
      "Reference": {
        "ShipDate": "YYYY-MM-DD",
        "CustomerReference": "YOUR_CUSTOMER_REFERENCE_NUMBER",
        "Type": "PO_NUMBER"
      }
    }
  }
}
```

--------------------------------

### Associate Accounts for Webhook Creation

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/account-number-subscription

Informs users that accounts must be associated with their organization before a webhook can be created, providing options to manage organizations or close the current view.

```Text
You cannot create a webhook without accounts
Associate accounts to your organisation then you can create a webhook
MANAGE ORGNAIZATION
CLOSE
```

--------------------------------

### Shipper loaded package into trailer

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

Indicates that the shipper has loaded the package into a trailer, signifying the start of the transit process.

```text
A38 | Your package was loaded into a trailer by the shipper
```

--------------------------------

### FedEx Shipment Structure Example

Source: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs

This snippet demonstrates a comprehensive JSON object representing a FedEx shipment. It includes details about package count, weight, battery information, special services such as COD and dry ice handling, and customs clearance data.

```json
{
    "codCollectionType": "ANY"
},
          {
            "pieceCountVerificationBoxCount": 0,
            "batteryDetails": [
            {
              "material": "LITHIUM_METAL",
              "regulatorySubType": "IATA_SECTION_II",
              "packing": "CONTAINED_IN_EQUIPMENT"
}
],
            "dryIceWeight": 
{
              "units": "LB",
              "value": 10
},
            "standaloneBatteryDetails": [
            {
              "batteryMaterialType": "LITHIUM_METAL"
}
]
}
},
    "documentShipment": false,
    "variableHandlingChargeDetail": 
{
      "rateType": "ACCOUNT",
      "percentValue": 0,
      "rateLevelType": "BUNDLED_RATE",
      "fixedValue": 
{
        "amount": "100",
        "currency": "USD"
},
      "rateElementBasis": "NET_CHARGE"
},
    "packagingType": "YOUR_PACKAGING",
    "totalPackageCount": 3,
    "totalWeight": 87.5,
    "shipmentSpecialServices": 
{
      "returnShipmentDetail": 
{
        "returnType": "PRINT_RETURN_LABEL"
},
      "deliveryOnInvoiceAcceptanceDetail": 
{
        "recipient": 
{
          "accountNumber": 
{
            "value": 123456789
},
          "address": 
{
            "streetLines": [
              "10 FedEx Parkway",
              "Suite 30"
],
            "countryCode": "US"
},
          "contact": 
{
            "companyName": "FedEx",
            "faxNumber": "9013577890",
            "personName": "John Taylor",
            "phoneNumber": "9013577890"
}
}
},
      "internationalTrafficInArmsRegulationsDetail": 
{
        "licenseOrExemptionNumber": "432345"
},
      "holdAtLocationDetail": 
{
        "locationId": "YBZA",
        "locationContactAndAddress": 
{
          "address": 
{
            "streetLines": [
              "10 FedEx Parkway",
              "Suite 302"
],
            "city": "Beverly Hills",
            "stateOrProvinceCode": "CA",
            "postalCode": "38127",
            "countryCode": "US",
            "residential": false
},
          "contact": 
{
            "personName": "person name",
            "emailAddress": "email address",
            "phoneNumber": "phone number",
            "phoneExtension": "phone extension",
            "companyName": "company name",
            "faxNumber": "fax number"
}
},
        "locationType": "FEDEX_ONSITE"
},
      "shipmentCODDetail": 
{
        "addTransportationChargesDetail": 
{
          "rateType": "ACCOUNT",
          "rateLevelType": "BUNDLED_RATE",
          "chargeLevelType": "CURRENT_PACKAGE",
          "chargeType": "COD_SURCHARGE"
},
        "codRecipient": 
{
          "accountNumber": 
{
            "value": 123456789
}
},
        "remitToName": "FedEx",
        "codCollectionType": "ANY",
        "financialInstitutionContactAndAddress": 
{
          "address": 
{
            "streetLines": [
              "10 FedEx Parkway",
              "Suite 302"
],
            "city": "Beverly Hills",
            "stateOrProvinceCode": "CA",
            "postalCode": "38127",
            "countryCode": "US",
            "residential": false
},
          "contact": 
{
            "personName": "person name",
            "emailAddress": "email address",
            "phoneNumber": "phone number",
            "phoneExtension": "phone extension",
            "companyName": "company name",
            "faxNumber": "fax number"
}
},
        "returnReferenceIndicatorType": "INVOICE"
},
      "shipmentDryIceDetail": 
{
        "totalWeight": 
{
          "units": "LB",
          "value": 10
},
        "packageCount": 12
},
      "internationalControlledExportDetail": 
{
        "type": "DEA_036"
},
      "homeDeliveryPremiumDetail": 
{
        "shipTimestamp": "2020-04-24",
        "homedeliveryPremiumType": "APPOINTMENT"
},
      "specialServiceTypes": [
        "BROKER_SELECT_OPTION"
]
},
    "customsClearanceDetail": 
{
      "brokers": [
        {
          "broker": 
{
            "accountNumber": 
{
              "value": 123456789
},
            "address": null,
            "contact": null
},
          "type": "IMPORT"
}
],
      "commercialInvoice": 
{
        "shipmentPurpose": "GIFT"
},
      "freightOnValue": "CARRIER_RISK",
      "dutiesPayment": 
{
        "payor": 
{
          "responsibleParty": 
{
            "address": 
{
              "streetLines": [
                "10 FedEx Parkway",
                "Suite 302"
],
              "city": "Beverly Hills",
              "stateOrProvinceCode": "CA",
              "postalCode": "90210",
              "countryCode": "US",
              "residential": false
},
            "contact": 
{
              "personName": "John Taylor",
              "emailAddress": "sample@company.com",
              "phoneNumber": "1234567890"
}
}
}
}
}
}
```

--------------------------------

### Track by Multiple-Piece Shipment (MPS) - FedEx API Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This example demonstrates tracking a Multiple-Piece Shipment (MPS) using either the master tracking number or a child package's tracking number via the FedEx API. The Package Identifier Type should be set to STANDARD_MPS when using the master tracking number.

```JSON
{
  "TrackRequest": {
    "WebAuthenticationDetail": {
      "UserCredential": {
        "Key": "YOUR_FEDEX_API_KEY",
        "Password": "YOUR_FEDEX_API_PASSWORD"
      }
    },
    "ClientDetail": {
      "AccountNumber": "YOUR_FEDEX_ACCOUNT_NUMBER",
      "MeterNumber": "YOUR_FEDEX_METER_NUMBER"
    },
    "Version": {
      "ServiceVersion": "10.0",
      "CarrierCode": "FDXE"
    },
    "TrackingInfo": {
      "TrackingNumber": "YOUR_MASTER_TRACKING_NUMBER",
      "PackageIdentifierType": "STANDARD_MPS"
    }
  }
}
```

--------------------------------

### Track by Tracking Numbers - FedEx API Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This snippet demonstrates how to track shipments using FedEx tracking numbers via an API. It typically involves sending a request with one or more tracking numbers and receiving shipment status information.

```JSON
{
  "TrackRequest": {
    "WebAuthenticationDetail": {
      "UserCredential": {
        "Key": "YOUR_FEDEX_API_KEY",
        "Password": "YOUR_FEDEX_API_PASSWORD"
      }
    },
    "ClientDetail": {
      "AccountNumber": "YOUR_FEDEX_ACCOUNT_NUMBER",
      "MeterNumber": "YOUR_FEDEX_METER_NUMBER"
    },
    "Version": {
      "ServiceVersion": "10.0",
      "CarrierCode": "FDXE"
    },
    "TrackingInfo": {
      "TrackingNumber": "YOUR_TRACKING_NUMBER_1",
      "TrackingNumber": "YOUR_TRACKING_NUMBER_2"
    }
  }
}
```

--------------------------------

### FedEx Open Ship API

Source: https://developer.fedex.com/api/en-us/project/create

The Open Ship API allows for the creation and entry of shipment information as it is received throughout the day, streamlining the shipping process.

```General
Create and enter information for a shipment as it is received throughout the day.
```

--------------------------------

### FedEx Pickup Request API

Source: https://developer.fedex.com/api/en-us/project/create

This API provides functionality to manage all aspects related to courier shipment pickups, ensuring efficient logistics coordination.

```General
Manage everything related to courier shipment pickups.
```

--------------------------------

### Ship transactions - JSON

Source: https://developer.fedex.com/api/en-us/get-started

This snippet refers to the JSON request/response files for ship transactions, specifically for three test cases covering PDF, PNG, and ZPL label image types.

```JSON
{
  "description": "Ship transaction for PDF label type"
}
{
  "description": "Ship transaction for PNG label type"
}
{
  "description": "Ship transaction for ZPL label type"
}
```

--------------------------------

### Send Notification Endpoint Setup

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This section describes the 'Send Notification' endpoint for setting up and customizing tracking event notifications for a shipment. It highlights that FedEx APIs do not support Cross-Origin Resource Sharing (CORS).

```markdown
## Send Notification 
This endpoint helps you setup up, customize the tracking event notifications to be received for a shipment.  
_Note: FedEx APIs do not support Cross-Origin Resource Sharing (CORS) mechanism.  

To learn more about how to get OAuth access token, refer to API Authorization documentation.
```

--------------------------------

### FedEx FDEG - Package Scanned at FedEx Ship N Get

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

Indicates that a FedEx Ground (FDEG) package was scanned at a FedEx Ship N Get location by the customer after the final pickup scan. This might suggest an unusual handling or return scenario.

```text
098B | FDEG - Package scanned at FedEx Ship N Get by customer after final location picku
```

--------------------------------

### Request Signature Proof of Delivery (SPOD) - FedEx API Example

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This snippet shows how to request Signature Proof of Delivery (SPOD) via the FedEx API. The response for SPOD will be a base64 encoded string representing the signature image.

```JSON
{
  "TrackRequest": {
    "WebAuthenticationDetail": {
      "UserCredential": {
        "Key": "YOUR_FEDEX_API_KEY",
        "Password": "YOUR_FEDEX_API_PASSWORD"
      }
    },
    "ClientDetail": {
      "AccountNumber": "YOUR_FEDEX_ACCOUNT_NUMBER",
      "MeterNumber": "YOUR_FEDEX_METER_NUMBER"
    },
    "Version": {
      "ServiceVersion": "10.0",
      "CarrierCode": "FDXE"
    },
    "TrackingInfo": {
      "TrackingNumber": "YOUR_TRACKING_NUMBER",
      "IncludeSignatureProofOfDelivery": true
    }
  }
}
```

--------------------------------

### FedEx Shipment Data Structure Example

Source: https://developer.fedex.com/api/en-us/catalog/service-availability/v1/docs

This JSON snippet illustrates a portion of the data structure used for FedEx shipments, detailing address, contact, and shipment-specific information like COD and dry ice details.

```json
{
  "shipment": {
    "shipper": {
      "contact": {
        "personName": "John Doe",
        "emailAddress": "john.doe@example.com",
        "phoneNumber": "1234567890"
      },
      "address": {
        "streetLines": [
          "1 FedEx Way"
        ],
        "city": "Memphis",
        "stateOrProvinceCode": "TN",
        "postalCode": "38116",
        "countryCode": "US"
      }
    },
    "recipient": {
      "contact": {
        "personName": "Jane Smith",
        "emailAddress": "jane.smith@example.com",
        "phoneNumber": "9876543210"
      },
      "address": {
        "streetLines": [
          "10 FedEx Parkway",
          "Suite 302"
        ],
        "city": "Beverly Hills",
        "stateOrProvinceCode": "CA",
        "postalCode": "38127",
        "countryCode": "US",
        "residential": false
      }
    },
    "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
    "carrierCodes": [
      "FDXE"
    ],
    "accountNumber": {
      "value": "123456789"
    },
    "systemOfMeasureType": "METRIC"
  }
}
```

--------------------------------

### Send Shipment Notification Request (JSON)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JSON payload for sending shipment notifications via the FedEx API. Includes sender details, tracking information, and notification preferences.

```json
{
  "senderContactName": "Sam Smith",
  "senderEMailAddress": "Lsr1234@gmail.com",
  "trackingEventNotificationDetail": {
    "trackingNotifications": [
      {
        "notificationDetail": {
          "localization": {
            "languageCode": "en",
            "localeCode": "US"
          },
          "emailDetail": {
            "emailAddress": "p1@fedex.com",
            "name": "Preethi"
          },
          "notificationType": "HTML"
        },
        "role": "SHIPPER",
        "notificationEventTypes": [
          "ON_DELIVERY",
          "ON_EXCEPTION",
          "ON_ESTIMATED_DELIVERY"
        ],
        "currentResultRequestedFlag": true
      }
    ],
    "personalMessage": "Personal message content",
    "supportHTML": null
  },
  "trackingNumberInfo": {
    "trackingNumber": "128667043726",
    "carrierCode": "FDXE",
    "trackingNumberUniqueId": "245822~123456789012~FDEG"
  },
  "shipDateBegin": "2019-10-13",
  "shipDateEnd": "2019-10-31"
}
```

--------------------------------

### End-customer registration transactions - JSON

Source: https://developer.fedex.com/api/en-us/get-started

This snippet refers to the JSON request/response files required for end-customer registration transactions, including Multi-Factor Authentication with invoice and PIN details for SMS, call, and email.

```JSON
{
  "description": "End-customer registration transaction with MFA details"
}
```

--------------------------------

### FedEx Comprehensive Rates and Transit Times API

Source: https://developer.fedex.com/api/en-us/project/create

This API allows users to request comprehensive rates before shipping, helping to determine potential costs accurately. It provides detailed information on shipping expenses.

```General
Request comprehensive rates prior to shipping in order to determine costs.
```

--------------------------------

### Find Locations API Request Example

Source: https://developer.fedex.com/api/en-us/catalog/locations/v1/docs

This snippet demonstrates a sample request to the FedEx Locations Search API to find nearby locations. It includes essential header parameters like content-type and authorization.

```HTTP
POST /locations/find HTTP/1.1
Host: your.api.host
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
X-Customer-Transaction-Id: 624deea6-b709-470c-8c39-4b5511281492
X-Locale: en_US

{
  "your_search_criteria": "value"
}
```

--------------------------------

### Check Pickup Availability Response Sample

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

This JSON object represents a successful response when checking pickup availability. It includes transaction details, timestamps, and available pickup options with associated times and carrier information. It also shows an example alert for a postal city mismatch.

```json
{
  "transactionId": "624deea6-b709-470c-8c39-4b5511281492",
  "customerTransactionId": "AnyCo_order123456789",
  "output": {
    "requestTimestamp": "2020-04-02T04:19:00",
    "options": [
      {
        "carrier": "FDXE",
        "available": true,
        "pickupDate": "2019-01-20",
        "cutOffTime": "18:30:00",
        "accessTime": {
          "hours": 1,
          "minutes": 30
        },
        "residentialAvailable": true,
        "countryRelationship": "INTERNATIONAL",
        "scheduleDay": "SAME_DAY",
        "defaultReadyTime": "14:00:00",
        "defaultLatestTimeOptions": "19:00:00",
        "earlyCutOffTime": "14:30:00",
        "earlyAccessTime": {
          "hours": 1,
          "minutes": 30
        },
        "earlyPickupLocationId": "PITA",
        "readyTimeOptions": [
          "11:00:00"
        ],
        "latestTimeOptions": [
          "12:00:00"
        ]
      }
    ],
    "alerts": [
      {
        "code": "SHIP.RECIPIENT.POSTALCITY.MISMATCH",
        "alertType": "NOTE",
        "message": "Recipient Postal-City Mismatch."
      }
    ]
  }
}
```

--------------------------------

### Download JSON Schema

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

Provides a link to download the JSON schema markup for webhook configurations. This schema defines the structure and data types for webhook-related JSON objects.

```text
DOWNLOAD JSON SCHEMA
```

--------------------------------

### Download JSON Schema for Webhooks

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/v1/docs

Provides the JSON schema for webhook configurations, allowing developers to understand the structure and required fields for setting up webhooks.

```JSON
{
  "type": "object",
  "properties": {
    "webhookUrl": {
      "type": "string",
      "format": "url",
      "description": "The URL to which webhook events will be sent."
    },
    "events": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "A list of events to subscribe to."
    },
    "filter": {
      "type": "object",
      "properties": {
        "trackingNumber": {
          "type": "string",
          "description": "Filter events by a specific tracking number."
        },
        "accountNumber": {
          "type": "string",
          "description": "Filter events by a specific account number."
        }
      },
      "description": "Optional filters for webhook events."
    }
  },
  "required": [
    "webhookUrl",
    "events"
  ]
}
```

--------------------------------

### Send Shipment Notification Response (JSON)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

Example JSON response for a successful shipment notification request. Includes transaction details, tracking number information, destination address, and alerts.

```json
{
  "transactionId": "624deea6-b709-470c-8c39-4b5511281492",
  "customerTransactionId": "AnyCo_order123456789",
  "output": {
    "TrackingNumberInfo": {
      "trackingNumber": "128667043726",
      "carrierCode": "FDXE",
      "trackingNumberUniqueId": "245822~123456789012~FDEG"
    },
    "destinationAddress": {
      "classification": "BUSINESS",
      "residential": false,
      "streetLines": [
        "1043 North Easy Street",
        "Suite 999"
      ],
      "city": "SEATTLE",
      "stateOrProvinceCode": "WA",
      "postalCode": "98101",
      "countryCode": "US",
      "countryName": "United States"
    },
    "recipientDetails": [
      [
        "[\"ON_ESTIMATED_DELIVERY\"]"
      ]
    ],
    "alerts": "TRACKING.DATA.NOTFOUND - Tracking data unavailable"
  }
}
```

--------------------------------

### Get Transit Times Between Source and Destination

Source: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs

Obtain transit times for FedEx services between specified source and destination locations. This helps in planning delivery schedules.

```API
POST /rate

Request Body:
{
  "accountNumber": "YOUR_ACCOUNT_NUMBER",
  "origin": {
    "postalCode": "90210",
    "countryCode": "US"
  },
  "destination": {
    "postalCode": "10001",
    "countryCode": "US"
  },
  "serviceType": "FEDEX_EXPRESS_SAVER"
}
```

--------------------------------

### Generate Production Secret Key - FedEx API

Source: https://developer.fedex.com/api/en-us/get-started

This section explains how to generate a production secret key for your FedEx API project. After your project is moved to production, you can access the 'Production key' tab on your API project overview page to generate the secret key.

```bash
Click the "Generate Secret Key" link under the "Secret key" column.
```

--------------------------------

### FedEx Trade Documents Upload API

Source: https://developer.fedex.com/api/en-us/project/create

This API facilitates the electronic submission of trade documentation, eliminating the need for printing and optimizing the customs clearance process.

```General
Electronically submit your trade documentation without printing to optimize the customs clearance process.
```

--------------------------------

### Track Shipment by Tracking Number (JSON Response Example)

Source: https://developer.fedex.com/api/en-us/catalog/track/v1/docs

This snippet demonstrates a typical JSON response from the FedEx API when tracking a shipment using a Tracking Control Number. It includes shipment status, estimated delivery times, location details, and shipment specifics.

```json
{
    "transactionShipments": [
        {
            "trackingNumber": "782749274927",
            "status": "HELD"
        }
    ],
    "estimatedDeliveryTimeWindow": {
        "description": "Description field",
        "window": {
            "begins": "2021-10-01T08:00:00",
            "ends": "2021-10-15T00:00:00-06:00"
        },
        "type": "ESTIMATED_DELIVERY"
    },
    "pieceCounts": [
        {
            "count": "35",
            "description": "picec count description",
            "type": "ORIGIN"
        }
    ],
    "originLocation": {
        "locationId": "SEA",
        "locationContactAndAddress": {
            "address": {
                "addressClassification": "BUSINESS",
                "residential": false,
                "streetLines": [
                    "1043 North Easy Street",
                    "Suite 999"
                ],
                "city": "SEATTLE",
                "stateOrProvinceCode": "WA",
                "postalCode": "98101",
                "countryCode": "US",
                "countryName": "United States"
            }
        }
    },
    "recipientInformation": {
        "address": {
            "addressClassification": "BUSINESS",
            "residential": false,
            "streetLines": [
                "1043 North Easy Street",
                "Suite 999"
            ],
            "city": "SEATTLE",
            "stateOrProvinceCode": "WA",
            "postalCode": "98101",
            "countryCode": "US",
            "countryName": "United States"
        }
    },
    "standardTransitTimeWindow": {
        "description": "Description field",
        "window": {
            "begins": "2021-10-01T08:00:00",
            "ends": "2021-10-15T00:00:00-06:00"
        },
        "type": "ESTIMATED_DELIVERY"
    },
    "shipmentDetails": {
        "contents": [
            {
                "itemNumber": "RZ5678",
                "receivedQuantity": "13",
                "description": "pulyurethane rope",
                "partNumber": "RK1345"
            }
        ],
        "beforePossessionStatus": false,
        "weight": [
            {
                "unit": "LB",
                "value": "22222.0"
            }
        ],
        "contentPieceCount": "3333",
        "splitShipments": [
            {
                "pieceCount": "10",
                "statusDescription": "status",
                "timestamp": "2019-05-07T08:00:07",
                "statusCode": "statuscode"
            }
        ]
    },
    "reasonDetail": {
        "description": "Wrong color",
        "type": "REJECTED"
    },
    "availableNotifications": [
        "ON_DELIVERY",
        "ON_EXCEPTION"
    ],
    "shipperInformation": {
        "address": {
            "addressClassification": "BUSINESS",
            "residential": false,
            "streetLines": [
                "1043 North Easy Street",
                "Suite 999"
            ],
            "city": "SEATTLE",
            "stateOrProvinceCode": "WA",
            "postalCode": "98101",
            "countryCode": "US",
            "countryName": "United States"
        }
    },
    "lastUpdatedDestinationAddress": {
        "addressClassification": "BUSINESS",
        "residential": false,
        "streetLines": [
            "1043 North Easy Street",
            "Suite 999"
        ],
        "city": "SEATTLE",
        "stateOrProvinceCode": "WA",
        "postalCode": "98101",
        "countryCode": "US",
        "countryName": "United States"
    }
    ],
    "alerts": "TRACKING.DATA.NOTFOUND - Tracking data unavailable",
    "successful": true
}
```

--------------------------------

### Get Detailed Rate Quote with Duty and Tax Estimates

Source: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs

Request detailed rate quotes, including transit times and estimates for duty and tax. This is available for domestic and international shipments and requires comprehensive shipment information.

```API
POST /rate

Request Body:
{
  "accountNumber": "YOUR_ACCOUNT_NUMBER",
  "origin": {
    "postalCode": "90210",
    "countryCode": "US",
    "residential": false
  },
  "destination": {
    "postalCode": "10001",
    "countryCode": "US",
    "residential": false
  },
  "package": {
    "weight": {
      "value": 5,
      "units": "LB"
    },
    "dimensions": {
      "length": 10,
      "width": 8,
      "height": 6,
      "units": "IN"
    },
    "declaredValue": {
      "amount": 100,
      "currency": "USD"
    }
  },
  "customsClearance": {
    "dutiesAndTaxes": {
      "type": "ESTIMATED"
    }
  },
  "serviceType": "INTERNATIONAL_PRIORITY"
}
```

--------------------------------

### Request OAuth Access Token

Source: https://developer.fedex.com/api/en-us/get-started

This snippet demonstrates how to request an OAuth access token, which is required for API transactions. The token is valid for one hour and needs to be refreshed programmatically before expiration. Refer to the API Authorization documentation for more details and ensure 'Reseller' is selected in the sample code dropdown.

```General
Refer to the API Authorization documentation for more details. When viewing sample code, make sure “Reseller” is chosen from samples dropdown.
```

--------------------------------

### Get OAuth Access Token

Source: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs

This section explains how to obtain an OAuth access token, which is required for authenticating requests to the FedEx API. Refer to the API Authorization documentation for detailed steps.

```text
To learn more about how to get OAuth access token, refer to API Authorization documentation.
```

--------------------------------

### Cancel Pickup Request Body Example

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

This JSON structure outlines the required and optional parameters for the Cancel Pickup request body. It includes the associated account number, pickup confirmation code, and scheduled date, along with optional fields for remarks and carrier code.

```json
{
  "associatedAccountNumber": "Your account number",
  "pickupConfirmationCode": "7",
  "remarks": "Please ring bell at loading dock.",
  "carrierCode": "FDXE",
  "accountAddressOfRecord": {
    "city": "CityName",
    "countryCode": "US",
    "streetLines": ["StreetLine1"],
    "postalCode": "12345",
    "addressVerificationIdentifier": "1",
    "stateOrProvinceCode": "CA"
  },
  "scheduledDate": "2019-10-15",
  "location": "LOSA"
}
```

--------------------------------

### Request OAuth Access Token for FedEx API

Source: https://developer.fedex.com/api/en-us/get-started

This process describes how to request an OAuth access token, which is required for each API transaction. The token is valid for one hour and must be programmatically refreshed before it expires.

```General
The OAuth access token must be used with each API transaction. The token is valid only for an hour, so you will need to programmatically code your application to refresh the token before the session expires. Refer to the API Authorization documentation for more details.
```

--------------------------------

### User Authentication for FedEx APIs

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/account-number-subscription

Explains the process of logging in using a user ID and password to gain access to FedEx APIs and provides a link for signing up if a user ID does not exist.

```Text
## Enter your user ID and password to log in
LOG IN
FORGOT PASSWORD OR USER ID? 
* * *
Get access to FedEx APIs by creating a user ID. 
SIGN UP
```

--------------------------------

### FedEx Ground Removed from Self-Service Location

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

An FDEG (FedEx Ground) shipment has been removed from a Ship and Get Self-Service Location.

```text
FDEG - Removed from Ship and Get Self-Service Location
```

--------------------------------

### FedEx API Request Headers

Source: https://developer.fedex.com/api/en-us/catalog/service-availability/v1/docs

This section details the required and optional header parameters for FedEx API requests. It includes transaction IDs, content type, locale, and authorization tokens, explaining their purpose and providing example values.

```http
POST /availability/v1/packageandserviceoptions HTTP/1.1
Host: apis.fedex.com
Content-Type: application/json
x-customer-transaction-id: 624deea6-b709-470c-8c39-4b5511281492
x-locale: en_US
Authorization: Bearer XXX
```

--------------------------------

### Test Webhook URL Functionality

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/introduction/test-webhook

This snippet outlines the steps to use the 'Test Webhook URL' functionality. It involves entering destination URL, security token, selecting payload language and tracking types, and accepting the license agreement before pushing for test results.

```Documentation
1. Click on **Test Webhook __ URL** button.
2. Enter the following Test parameters: Field Name | Description  
---|---
Destination URL | This is the URL to receive the Tracking event data/payload.
     * Customer should provide a working and valid destination URL.
     * Destination URL provided must be in the standardized syntactical format (secure https URL).  
Security Token | Used as shared secret to authenticate and validate Advanced Integrated Visibility webhook response.
     * Token value must be between minimum length of 26 characters and maximum of 100 characters.
     * At least 1 uppercase, 1 lowercase and 1 numeric character are required.
     * Security Token will be used to create Hash-based Message Authentication Code (HMAC) signature for response validation.  
Payload language | Select the preferred language for tracking data translation from the drop-down list. Following are the available 6 sample languages:
     * English (United States)_**(Default)**_  
Tracking Type | Select type of response in which tracking data needs to be received.
     * Detailed Tracking Response (Response type consists of secured tracking data with entire history of events).**(Default)**
     * Event-Specific Tracking Response (Response type consists of secured tracking data with only the most recent event information).**(Coming soon)**  
Tracking events | Select one higher-level category to receive email notifications related to shipment events in the package lifecycle. Following are the higher-level categories:
     * Ship
     * In Transit
     * Delivery
     * Exceptions
     * Estimated Delivery  
Status Event | A tracking event in the packages’ lifecycle. Select one of the tracking events to be received. Following are the available 10 sample status events:
    1. Picked up
    2. In transit
    3. Delivered
    4. Delivery Exception
  
__
__**Note:** “_** _Status Event_** _” field values will be populated based on the selected "**_Tracking Event Category_** ". Refer the following table to learn more about the “** _Tracking Event Category_** ” and their respective “** _Status Events_** ”.__
  

Status Event Category | Status Event  
---|---
Ship | 
     * Picked up  
In-Transit | 
     * In transit  
Delivery | 
     * Delivered  
Exceptions | 
     * Delivery Exception  
Estimated Delivery**(Coming Soon)** | 
     * Estimated Delivery Date (EDD)
     * Estimated Delivery Time Window (EDTW)  
  3. Check the **FedEx Developer Portal License Agreement (FDPLA)** box to Sign/Accept the License Agreement.
  4. Click the **PUSH** button to view test results.
```

--------------------------------

### FedEx Ground Held at Self-Service Location

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

Indicates that an FDEG (FedEx Ground) shipment is being held at a Ship and Get Self-Service Location.

```text
FDEG - Held at Ship and Get Self-Service Location
```

--------------------------------

### FedEx Rates and Transit Times API

Source: https://developer.fedex.com/api/en-us/project/create

This API allows users to request pre-ship rating information to determine shipping costs and transit times, aiding in logistical planning.

```General
Request pre-ship rating information to determine costs.
```

--------------------------------

### FedEx Third Party - Tracking Number Subscription Guide

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/tracking-number-subscription

Information for Third Parties on how to subscribe to tracking numbers for secure, real-time FedEx tracking updates using Advanced Integrated Visibility. This is for entities that are not certified FedEx Compatible providers but use FedEx technology.

```English
Learn about Tracking number subscription – Third Party to get secure, real-time FedEx tracking updates via Advanced Integrated Visibility
**CLICK TO LEARN MORE**
```

--------------------------------

### FedEx Pickup Exception: Not Ready

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

An FX shipment pickup has been attempted but was unsuccessful because the package was not ready. This is a pickup exception.

```text
FX - PICKUP EXCEPTION - PICKUP NOT READY
```

--------------------------------

### Check Pickup Availability Request Payload

Source: https://developer.fedex.com/api/en-us/catalog/pickup/v1/docs

Example JSON payload for checking FedEx pickup availability. It includes details like pickup address, dispatch date, package ready time, customer close time, pickup type, pickup request type, shipment attributes (service type, weight, packaging, dimensions), number of business days, package details, associated account number, associated account number type, carriers, and country relationship.

```json
{
  "pickupAddress": {
    "streetLines": [
      "123 Ship Street"
    ],
    "urbanizationCode": "URB FAIR OAKS",
    "city": "Memphis",
    "stateOrProvinceCode": "TN",
    "postalCode": "38017",
    "countryCode": "US",
    "residential": false,
    "addressClassification": "MIXED"
  },
  "dispatchDate": "2020-10-14",
  "packageReadyTime": "15:30:00",
  "customerCloseTime": "18:00:00",
  "pickupType": "ON_CALL",
  "pickupRequestType": [
    "SAME_DAY"
  ],
  "shipmentAttributes": {
    "serviceType": "FEDEX_FREIGHT_PRIORITY",
    "weight": {
      "units": "KG",
      "value": 20
    },
    "packagingType": "YOUR_PACKAGING",
    "dimensions": {
      "length": 7,
      "width": 8,
      "units": "CM",
      "height": 9
    }
  },
  "numberOfBusinessDays": 1,
  "packageDetails": [
    {
      "packageSpecialServices": {
        "specialServiceTypes": [
          "SIGNATURE_OPTION"
        ]
      }
    }
  ],
  "associatedAccountNumber": "613787364",
  "associatedAccountNumberType": "FEDEX_EXPRESS",
  "carriers": [
    "FDXE"
  ],
  "countryRelationship": "INTERNATIONAL"
}
```

--------------------------------

### FedEx FX - Package Available for Clearance

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/aiv-reason-codes

No description

--------------------------------

### Generate Security Token for FedEx API

Source: https://developer.fedex.com/api/en-us/get-started

This snippet demonstrates the requirements for generating a security token to authenticate and validate information transmitted between your organization and FedEx. The token must meet specific length and character type criteria.

```General
A minimum length of 26 characters and a maximum length of 100 characters
1 upper case character
1 lower case character
1 numeric character
```

--------------------------------

### Download Shipment Visibility Webhook Schema

Source: https://developer.fedex.com/api/en-us/catalog/shipment-visibility-webhook/docs/introduction/business-rules-and-best-practices

Provides the JSON schema for the Shipment Visibility Webhook, which enables near real-time tracking updates for packages associated with FedEx accounts.

```JSON
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ShipmentVisibilityWebhook",
  "description": "Schema for FedEx Shipment Visibility Webhook configuration.",
  "type": "object",
  "properties": {
    "webhookUrl": {
      "description": "The HTTPS URL to receive tracking updates.",
      "type": "string",
      "format": "uri"
    },
    "eventTypes": {
      "description": "The types of tracking events to subscribe to.",
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["SHIPMENT", "DELIVERY", "EXCEPTION"]
      }
    },
    "filter": {
      "description": "Optional filter for specific shipments.",
      "type": "object",
      "properties": {
        "trackingNumber": {
          "description": "Filter by a specific tracking number.",
          "type": "string"
        }
      }
    }
  },
  "required": [
    "webhookUrl",
    "eventTypes"
  ]
}
```

--------------------------------

### Get Available Services with Service Availability API

Source: https://developer.fedex.com/api/en-us/Api-recipes/us-domestic-e-commerce

Retrieves available FedEx services, special service options, and packaging types based on recipient and shipping information. This allows customers to choose their preferred shipping methods.

```OpenAPI
GET /services/available

```

--------------------------------

### FedEx Special Delivery Service

Source: https://developer.fedex.com/api/en-us/guides/api-reference

Covers special handling services requested by the customer that go beyond standard pickup and delivery features outlined in the FedEx Service Guide.

```text
SPECIAL_DELIVERY
When the shipper or recipient requests a special handling service beyond the standard pickup and delivery features of service outlined in the FedEx Service Guide.
```

--------------------------------

### Find Locations Request Payload (JSON)

Source: https://developer.fedex.com/api/en-us/catalog/locations/v1/docs

This JSON payload demonstrates a request to find FedEx locations. It includes parameters for search criteria, location details, sorting, and package attributes. The example showcases various options like distance, maximum results, and specific location capabilities.

```json
{
  "locationsSummaryRequestControlParameters": {
    "distance": {
      "units": "KM",
      "value": 3.5
    },
    "maxResults": 12
  },
  "constraints": {
    "locationContentOptions": [
      "LOCATION_DROPOFF_TIMES"
    ],
    "dropOffTimeNeeded": "16:30:00",
    "excludeUnavailableLocations": "true"
  },
  "locationSearchCriterion": "ADDRESS",
  "location": {
    "address": {
      "streetLines": [
        "10 FedEx Parkway",
        "Suite 302"
      ],
      "city": "Beverly Hills",
      "stateOrProvinceCode": "CA",
      "postalCode": "90210",
      "countryCode": "US",
      "residential": false
    },
    "longLat": {
      "latitude": 5.637376,
      "longitude": 3.61607
    }
  },
  "phoneNumber": "9015551234",
  "multipleMatchesAction": "RETURN_ALL",
  "sort": {
    "criteria": "DISTANCE",
    "order": "ASCENDING"
  },
  "trackingInfo": {
    "uniqueTrackingId": "789645",
    "trackingNumber": "123456789012",
    "shipDate": "2019-10-13"
  },
  "sameState": true,
  "sameCountry": true,
  "redirectToHoldType": "FEDEX_GROUND",
  "locationAttrTypes": [
    "ACCEPTS_CASH",
    "PACK_AND_SHIP"
  ],
  "locationCapabilities": [
    {
      "carrierCode": "FDXE",
      "serviceType": "PRIORITY_OVERNIGHT",
      "transferOfPossessionType": "DROPOFF",
      "serviceCategory": "EXPRESS_FREIGHT",
      "daysOfWeek": [
        "MON",
        "TUE"
      ]
    }
  ],
  "packageAttributes": [
    {
      "weight": {
        "units": "LB",
        "value": 150
      },
      "dimensions": {
        "length": 20,
        "width": 40,
        "units": "IN",
        "height": 70
      }
    }
  ],
  "locationTypes": [
    "FEDEX_AUTHORIZED_SHIP_CENTER"
  ],
  "includeHoliday": true,
  "dropoffTime": "09:30:00",
  "dropOffServiceType": "GROUND",
  "carrierCodes": [
    "FDXE"
  ],
  "getCall": false
}
```

--------------------------------

### Get Rate Quotes with Rate and Transit Times API

Source: https://developer.fedex.com/api/en-us/Api-recipes/us-domestic-e-commerce

Fetches estimated rate quotes and optional transit time information for the order. This helps inform customers about delivery timelines and costs.

```OpenAPI
POST /rates/transit-times
```

--------------------------------

### FedEx Account Registration API

Source: https://developer.fedex.com/api/en-us/project/create

The Account Registration API is designed for FedEx® Compatible providers. It facilitates the generation of Customer Keys and Secret Keys, enabling the onboarding of customers to utilize FedEx APIs.

```General
Used by FedEx® Compatible providers to generate Customer Keys and Secret Keys to onboard customers to use FedEx APIs
```

--------------------------------

### Specify Standalone Lithium Battery Shipment

Source: https://developer.fedex.com/api/en-us/catalog/service-availability/v1/docs

This code example shows how to specify a standalone lithium battery shipment using the STANDALONE_BATTERY enum within the specialServiceTypes. This is applicable for intra-European regions and requires additional details in the standaloneBatteryDetails element.

```JSON
{
  "shipmentRequest": {
    "specialServiceTypes": [
      "STANDALONE_BATTERY"
    ],
    "standaloneBatteryDetails": {
      // Details for standalone battery shipment
    }
  }
}
```

--------------------------------

### FedEx Credential Registration API

Source: https://developer.fedex.com/api/en-us/project/create

Similar to the Account Registration API, the Credential Registration API is for FedEx® Compatible providers to generate Customer Keys and Secret Keys for customer onboarding to FedEx APIs.

```General
Used by FedEx® Compatible providers to generate Customer Keys and Secret Keys to onboard customers to use FedEx APIs
```

--------------------------------

### Get Tracking Number Job Status

Source: https://developer.fedex.com/api/en-us/support

This endpoint retrieves the status of an asynchronous job or the status of all submitted jobs related to tracking number association. It helps in monitoring the progress of your tracking number subscriptions.

```shell
GET /webhooks/tracking/job-status?projectId=your-project-id
GET /webhooks/tracking/job-status?jobId=your-job-id
```

--------------------------------

### FedEx Freight LTL API

Source: https://developer.fedex.com/api/en-us/project/create

The Freight LTL API assists in obtaining rate estimates, processing shipments, and managing pickups for FedEx Freight® Less Than Truckload (LTL) shipments.

```General
Get rate estimates, process shipments and manage pickups for FedEx Freight® LTL shipments.
```

--------------------------------

### Retrieve Transit Times Request Payload

Source: https://developer.fedex.com/api/en-us/catalog/service-availability/v1/docs

Example JSON payload for requesting transit times via the FedEx API. It includes shipper and recipient details, service type, packaging, shipment dates, and package line item information with special services.

```json
{
  "requestedShipment": {
    "shipper": {
      "address": {
        "city": "Collierville",
        "stateOrProvinceCode": "TN",
        "postalCode": "38127",
        "countryCode": "US",
        "residential": false
      }
    },
    "recipients": [
      {
        "address": {
          "city": "Collierville",
          "stateOrProvinceCode": "TN",
          "postalCode": "38127",
          "countryCode": "US",
          "residential": false
        }
      }
    ],
    "serviceType": "FEDEX_GROUND",
    "packagingType": "YOUR_PACKAGING",
    "shipDatestamp": "2019-09-01",
    "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
    "shippingChargesPayment": {
      "payor": {
        "responsibleParty": {
          "address": {
            "city": "Collierville",
            "stateOrProvinceCode": "TN",
            "postalCode": "38127",
            "countryCode": "US",
            "residential": false
          },
          "accountNumber": {
            "value": "60xxxxxx2"
          }
        }
      },
      "paymentType": "COLLECT"
    },
    "requestedPackageLineItems": [
      {
        "declaredValue": {
          "amount": 12,
          "currency": "USD"
        },
        "weight": {
          "units": "LB",
          "value": 68.25
        },
        "dimensions": {
          "length": 100,
          "width": 50,
          "height": 30,
          "units": "CM"
        },
        "packageSpecialServices": {
          "specialServiceTypes": [
            "DANGEROUS_GOODS",
            "COD"
          ],
          "codDetail": {
            "codCollectionAmount": {
              "amount": 12.45,
              "currency": "USD"
            }
          },
          "dryIceWeight": {
            "units": "LB",
            "value": 10
          },
          "dangerousGoodsDetail": {
            "accessibility": "ACCESSIBLE",
            "options": [
              "BATTERY"
            ]
          },
          "alcoholDetail": {
            "alcoholRecipientType": "LICENSEE",
            "shipperAgreementType": "retailer"
          },
          "pieceCountVerificationBoxCount": 2,
          "batteryDetails": {
            "batteryMaterialType": "LITHIUM_METAL",
            "batteryPackingType": "CONTAINED_IN_EQUIPMENT",
            "batteryRegulatoryType": "IATA_SECTION_II"
          }
        }
      }
    ],
    "shipmentSpecialServices": {
      "specialServiceTypes": [
        "BROKER_SELECT_OPTION"
      ],
      "codDetail": {
        "codCollectionAmount": {
          "amount": 12.45,
          "currency": "USD"
        },
        "codCollectionType": "PERSONAL_CHECK"
      },
      "internationalControlledExportDetail": {
        "type": "DSP_LICENSE_AGREEMENT"
      },
      "homeDeliveryPremiumDetail": {
        "homedeliveryPremiumType": "EVENING"
      },
      "holdAtLocationDetail": {
        "locationId": "YBZA",
        "locationType": "FEDEX_ONSITE",
        "locationContactAndAddress": {
          "contact": {
            "personName": "John Taylor",
            "emailAddress": "sample@company.com",
            "phoneNumber": "1234567890",
            "phoneExtension": "1234",
            "faxNumber": "1234567890",
            "companyName": "Fedex"
          },
          "address": {
            "city": "Collierville",
            "stateOrProvinceCode": "TN",
            "postalCode": "38127",
            "countryCode": "US",
            "residential": false
          }
        }
      },
      "shipmentDryIceDetail": {
        "totalWeight": {
          "units": "LB",
          "value": 10
        },
        "packageCount": 12
      }
    },
    "customsClearanceDetail": {
      "commodities": [
        {
          "description": "DOCUMENTS",
          "quantity": 1,
          "unitPrice": {
            "amount": 12.45,
            "currency": "USD"
          },
          "weight": {
    