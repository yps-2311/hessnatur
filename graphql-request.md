# GraphQL Request - getAllAvailabilities

## Endpoint
```
https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app/api/graphql
```

## Formatierter Request Body
```json
{
  "operationName": "getAllAvailabilities",
  "variables": {
    "code": "57098",
    "lang": "de",
    "country": "de"
  },
  "query": "query getAllAvailabilities($code: String!, $lang: String!, $country: String!) {\n  allAvailabilities(code: $code, lang: $lang, country: $country) {\n    id\n    styles {\n      id\n      name\n      imgUrl\n      sizes {\n        id\n        name\n        availabilityIndex\n        deliveryTime\n        price {\n          formattedValue\n          currencyIso\n          netValue\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
}
```

## GraphQL Query (formatiert)
```graphql
query getAllAvailabilities($code: String!, $lang: String!, $country: String!) {
  allAvailabilities(code: $code, lang: $lang, country: $country) {
    id
    styles {
      id
      name
      imgUrl
      sizes {
        id
        name
        availabilityIndex
        deliveryTime
        price {
          formattedValue
          currencyIso
          netValue
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
```

---

## cURL Befehl
```bash
curl -X POST \
  'https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app/api/graphql' \
  -H 'Content-Type: application/json' \
  -d '{
  "operationName": "getAllAvailabilities",
  "variables": {
    "code": "57098",
    "lang": "de",
    "country": "de"
  },
  "query": "query getAllAvailabilities($code: String!, $lang: String!, $country: String!) {\n  allAvailabilities(code: $code, lang: $lang, country: $country) {\n    id\n    styles {\n      id\n      name\n      imgUrl\n      sizes {\n        id\n        name\n        availabilityIndex\n        deliveryTime\n        price {\n          formattedValue\n          currencyIso\n          netValue\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
}'
```

## JavaScript (fetch)
```javascript
fetch('https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    operationName: 'getAllAvailabilities',
    variables: {
      code: '57098',
      lang: 'de',
      country: 'de'
    },
    query: `query getAllAvailabilities($code: String!, $lang: String!, $country: String!) {
  allAvailabilities(code: $code, lang: $lang, country: $country) {
    id
    styles {
      id
      name
      imgUrl
      sizes {
        id
        name
        availabilityIndex
        deliveryTime
        price {
          formattedValue
          currencyIso
          netValue
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## Python (requests)
```python
import requests
import json

url = 'https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app/api/graphql'

payload = {
    "operationName": "getAllAvailabilities",
    "variables": {
        "code": "57098",
        "lang": "de",
        "country": "de"
    },
    "query": """query getAllAvailabilities($code: String!, $lang: String!, $country: String!) {
  allAvailabilities(code: $code, lang: $lang, country: $country) {
    id
    styles {
      id
      name
      imgUrl
      sizes {
        id
        name
        availabilityIndex
        deliveryTime
        price {
          formattedValue
          currencyIso
          netValue
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
"""
}

headers = {
    'Content-Type': 'application/json'
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```
