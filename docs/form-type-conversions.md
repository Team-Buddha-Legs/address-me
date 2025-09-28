# Form Type Conversions

This document describes the type conversion logic implemented in the FormInput component to handle mismatches between form field types and validation schema expectations.

## Overview

The assessment form has several fields where the HTML form input type doesn't match the expected validation schema type. The FormInput component handles these conversions automatically.

## Type Conversions

### 1. Boolean Fields

**Field:** `hasChildren` (Family Information step)

- **Form Type:** Radio buttons with string values ("true", "false")
- **Schema Type:** `z.boolean()`
- **Conversion:** String "true" → `true`, String "false" → `false`

```typescript
// Radio button onChange handler
if (field.id === "hasChildren") {
  onChange(rawValue === "true"); // Convert string to boolean
} else {
  onChange(rawValue);
}

// Checked state comparison
checked={
  field.id === "hasChildren" 
    ? value === (option.value === "true")
    : value === option.value
}
```

### 2. Number Array Fields

**Field:** `childrenAges` (Family Information step)

- **Form Type:** Text input with comma-separated values
- **Schema Type:** `z.array(z.number().int().min(0).max(25)).optional()`
- **Conversion:** "5, 8, 12" → `[5, 8, 12]`

```typescript
// Text input onChange handler
if (field.id === "childrenAges") {
  if (e.target.value.trim() === "") {
    newValue = [];
  } else {
    newValue = e.target.value
      .split(",")
      .map(age => parseInt(age.trim()))
      .filter(age => !isNaN(age));
  }
}

// Display value conversion
value={
  field.id === "childrenAges" && Array.isArray(value)
    ? value.join(", ")
    : value || ""
}
```

### 3. String Array Fields

**Field:** `healthConditions` (Health Information step)

- **Form Type:** Text input with comma-separated values
- **Schema Type:** `z.array(z.string()).optional()`
- **Conversion:** "diabetes, hypertension" → `["diabetes", "hypertension"]`

```typescript
// Text input onChange handler
if (field.id === "healthConditions") {
  if (e.target.value.trim() === "") {
    newValue = [];
  } else {
    newValue = e.target.value
      .split(",")
      .map(condition => condition.trim())
      .filter(condition => condition.length > 0);
  }
}

// Display value conversion
value={
  (field.id === "childrenAges" || field.id === "healthConditions") && Array.isArray(value)
    ? value.join(", ")
    : value || ""
}
```

## Implementation Details

### FormInput Component Logic

The conversion logic is implemented in the `FormInput` component's `onChange` handlers:

1. **Radio Buttons:** Special handling for `hasChildren` field to convert string values to booleans
2. **Text Inputs:** Special handling for array fields (`childrenAges`, `healthConditions`) to convert comma-separated strings to arrays
3. **Display Values:** Reverse conversion to show arrays as comma-separated strings in text inputs

### Validation Integration

The converted values are validated using the appropriate Zod schemas:

- `familyStepSchema` - Validates boolean `hasChildren` and number array `childrenAges`
- `healthStepSchema` - Validates string array `healthConditions`

## Testing

Comprehensive tests ensure the conversions work correctly:

- **Unit Tests:** Validate individual field conversions
- **Integration Tests:** Test form component behavior with real user interactions
- **Validation Tests:** Ensure converted values pass Zod schema validation

### Test Coverage

- ✅ Boolean conversion (hasChildren)
- ✅ Number array conversion (childrenAges)
- ✅ String array conversion (healthConditions)
- ✅ Display value formatting
- ✅ Empty value handling
- ✅ Validation schema compliance

## Error Prevention

These conversions prevent common form validation errors:

- ❌ "Expected boolean, received string" (hasChildren)
- ❌ "Expected array, received string" (healthConditions)
- ❌ Type mismatches in form submission

## Future Considerations

If additional fields require type conversion:

1. Add field-specific logic in the `onChange` handlers
2. Update display value logic for proper formatting
3. Add comprehensive tests for the new conversion
4. Update this documentation

The conversion system is designed to be extensible and maintainable while ensuring type safety throughout the form submission process.