echo """{
  \"flags\": {
    \"advanced-waitlist-ui\": {
      \"state\": \"ENABLED\",
      \"variants\": {
        \"on\": true,
        \"off\": false
      },
      \"defaultVariant\": \"off\",
      \"targeting\": {
        \"if\": [
          {
            \"==\": [{ \"var\": \"emailDomain\" }, \"gmail.com\"]
          },
          \"on\",
          \"off\"
        ]
      }
    },
    \"advanced-waitlist-auto-promote\": {
      \"state\": \"ENABLED\",
      \"variants\": {
        \"on\": true,
        \"off\": false
      },
      \"defaultVariant\": \"off\",
      \"targeting\": {
        \"if\": [
          {
            \"==\": [{ \"var\": \"emailDomain\" }, \"gmail.com\"]
          },
          \"on\",
          \"off\"
        ]
      }
    }
  }
}
""" > apps/backend/flags.flagd.json