# Upright Cultivate — Business Rules

**Document:** `BUSINESS_RULES.md`  
**Version:** V1  
**Status:** Working specification  
**Last updated:** 2026-09-19

---

## 1. Business Overview

Upright Cultivate is a B2B fresh-produce supply business serving commercial customers such as:

- Restaurants
- Hotels
- Cafés
- Retailers / supermarkets
- Catering businesses
- Meal-prep businesses
- Commercial kitchens
- Other approved business customers

The platform supports a controlled supply workflow:

**Customer → Supply Request → Admin Review → Quote → Customer Acceptance → Order → Preparation/Growing → Delivery → Invoice → Payment → Completed**

The platform is primarily a **B2B supply request, quotation, order, and invoicing system** in V1.

Farm-production management such as crop allocation, growing-cycle planning, demand forecasting, production planning, and detailed delivery-cycle operations are outside the V1 application scope.

---

## 2. Customer Accounts

### 2.1 Account Requirement

Customers must have an account before they can submit a supply request.

### 2.2 Customer Information

A customer account should contain, at minimum:

- Name
- Email address
- Phone number where required
- Password / authentication credentials
- Account status
- Created date
- Updated date

### 2.3 Email Verification

Email verification is required before sensitive customer actions are permitted.

### 2.4 Customer Ownership

A customer may only access and modify resources belonging to their own account or business.

The server must never trust a customer-supplied:

- `userId`
- `customerId`
- `businessId`
- `locationId`
- `orderId`
- `quoteId`
- `invoiceId`

Ownership must be determined and verified server-side.

---

## 3. Businesses

A customer may manage one or more businesses.

A business should contain:

- Business name
- Business type
- Contact information
- Associated customer account
- One or more delivery locations

Supported business types include:

- Restaurant
- Hotel
- Café
- Retail
- Catering
- Meal prep
- Commercial kitchen
- Other

A customer must not be able to access another customer's business.

---

## 4. Delivery Locations

Customers can manage multiple business / delivery locations.

Each location should contain:

- Location name
- Address
- Contact person
- Contact phone
- Optional delivery notes
- Associated business
- Active/inactive state

A supply request, order, and delivery must reference a valid customer-owned location.

Deleting a location that is referenced by historical orders or invoices should not destroy historical records. Prefer deactivation/soft deletion where necessary.

---

## 5. Products

Products are fresh-produce items offered by Upright Cultivate.

Examples include:

- Romaine
- Butterhead
- Kale
- Basil
- Spring onions
- Other approved produce

Each product may have:

- Name
- Description
- Category
- Image
- Active/inactive state
- Unit of sale
- Base price
- Availability information
- Created date
- Updated date

### 5.1 Units

A product may be sold:

- Per kilogram (`kg`)
- Per unit

The unit must be explicitly stored rather than inferred from the product name.

### 5.2 Product Status

Inactive products should not be selectable for new supply requests, while historical records must retain the product information needed to understand previous transactions.

---

## 6. Pricing

### 6.1 Base Pricing

Each product has a standard price according to its configured unit.

Examples:

- ₦X per kg
- ₦X per unit

### 6.2 V1 Pricing Rules

For V1:

- No quantity-based pricing.
- No customer-specific pricing.
- No location-specific pricing.
- No V1 bulk discounts.
- Subscription pricing uses the same product pricing by default.
- Prices are managed by admins.

### 6.3 Historical Pricing

A quote/order must preserve the price used at the time of the transaction.

Changing a product's current price must not silently change an existing quote, order, or invoice.

---

## 7. Product Availability

Product availability may change based on current stock, growing status, or production planning.

### 7.1 Availability Behavior

If the full requested quantity is not currently available:

- V1 waits until the full requested quantity can be supplied.
- Partial fulfillment is not assumed.
- Admin may provide an estimated availability date.

### 7.2 Availability Is Not an Order Confirmation

A product being displayed as available does not by itself create an order.

The customer must complete the supply-request and quotation workflow.

---

## 8. Supply Requests

A supply request represents a customer's intention to purchase produce.

A request may contain:

- Customer/business
- Delivery location
- Requested products
- Quantities
- Units
- Preferred delivery date
- Supply frequency if recurring
- Special/event information where applicable
- Customer notes
- Created date
- Updated date
- Status

### 8.1 Request Statuses

Suggested V1 statuses:

- `DRAFT`
- `SUBMITTED`
- `UNDER_REVIEW`
- `QUOTED`
- `ACCEPTED`
- `REJECTED`
- `CANCELLED`
- `CONVERTED`

Exact enum names may be adjusted during implementation, but transitions must remain explicit.

### 8.2 Submission

A request becomes actionable when the customer submits it.

The server must validate:

- Customer authentication
- Customer ownership
- Product existence
- Product active status
- Valid quantity
- Valid unit
- Valid location
- Required request information

---

## 9. Supply Planner

The public Supply Planner helps a customer describe what they need.

The planner may collect:

- Business type
- Products
- Quantities
- Unit
- Supply frequency
- Delivery location
- Notes
- Special/event information

The planner is an input experience, not the source of truth.

Final values must be validated and stored by the server.

### 9.1 Quantity

V1 planner quantity is capped at:

**500 kg per product/requested quantity input unless a future business rule changes this.**

The implementation must not rely only on frontend limits.

---

## 10. Direct Purchase

Direct purchase does not mean instant checkout.

V1 flow:

1. Customer selects products.
2. Customer submits a supply request.
3. Admin reviews the request.
4. Admin determines availability and delivery expectations.
5. Admin creates a quote.
6. Customer reviews the quote.
7. Customer accepts the quote.
8. The accepted quote becomes an order.
9. Produce is prepared/grown as necessary.
10. Delivery is made.
11. Invoice/payment is handled according to the configured billing process.

A customer should not be charged merely because a supply request was submitted.

---

## 11. Quotes

A quote is an offer from Upright Cultivate to supply the requested products under specified commercial terms.

A quote should contain:

- Quote number
- Customer/business
- Delivery location
- Line items
- Product
- Quantity
- Unit
- Unit price
- Line total
- Subtotal
- Additional charges where applicable
- Total
- Estimated availability/delivery information
- Valid-until date where applicable
- Notes
- Quote status
- Created date
- Updated date

### 11.1 Quote Pricing

Quote prices must be captured at quote creation.

Future product-price changes must not modify the quote.

### 11.2 Quote Statuses

Suggested statuses:

- `DRAFT`
- `SENT`
- `ACCEPTED`
- `REJECTED`
- `EXPIRED`
- `CANCELLED`

---

## 12. Quote Acceptance

A customer may accept a quote only if:

- The customer is authenticated.
- The quote belongs to the customer.
- The quote is still valid.
- The quote has not already been accepted.
- The quote has not been cancelled or expired.

### 12.1 Acceptance Transaction

Accepting a quote must be handled server-side and atomically.

The operation should:

1. Verify authentication.
2. Verify customer role.
3. Verify quote ownership.
4. Verify quote status.
5. Verify quote validity.
6. Create the order.
7. Mark the quote as accepted.
8. Commit the transaction.

If the transaction fails, the quote and order must not be left in an inconsistent state.

---

## 13. Orders

An order represents a confirmed commercial commitment following quote acceptance.

An order should preserve:

- Order number
- Customer/business
- Delivery location
- Quote reference
- Line items
- Quantities
- Units
- Prices
- Total
- Delivery information
- Order status
- Created date
- Updated date

### 13.1 Order Statuses

Suggested V1 statuses:

- `CONFIRMED`
- `PREPARING`
- `READY`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`
- `COMPLETED`

The exact implementation may simplify these states, but invalid transitions must be prevented.

---

## 14. Growing / Preparation

When requested products are unavailable, the admin/grower may arrange for the required produce to be grown or prepared before delivery.

For V1, the application does not need to model detailed farm operations.

The platform only needs to retain commercially relevant information such as:

- Availability estimate
- Expected delivery date
- Order status
- Admin notes

Detailed crop production is V2.

---

## 15. Delivery

Deliveries are made according to availability and the operating schedule determined by the business.

### 15.1 Delivery Date

The customer may request a preferred delivery date.

The requested date is **not automatically confirmed**.

The admin/grower confirms the actual delivery date based on:

- Product availability
- Preparation/growing requirements
- Delivery scheduling
- Existing business commitments

### 15.2 Delivery Cycles

For V1, detailed delivery-cycle management is not implemented as a separate operational system.

Admin/grower may use the order's delivery information and internal processes.

A dedicated delivery-cycle management system is planned for V2.

---

## 16. Subscriptions / Recurring Supply

Customers may request recurring supply.

The customer can indicate:

- Preferred frequency
- Products
- Quantities
- Delivery location
- Preferred schedule

Supported frequency concepts include:

- Weekly
- Twice per week
- Multiple times per week
- Not sure / discuss with us

### 16.1 Confirmation

A customer's requested schedule is not automatically confirmed.

Admin/grower reviews the request and confirms the actual recurring arrangement.

### 16.2 Customer Management

V1 should support the intended customer experience for managing recurring supply, including:

- Pause
- Resume
- Cancel
- Change quantity
- Change products
- Change location
- Change frequency

Implementation details may be simplified where necessary to keep V1 within scope.

### 16.3 Pricing

Subscription pricing uses the standard product pricing by default.

No automatic bulk discount is assumed in V1.

---

## 17. Invoices

Invoices represent amounts due for completed supply transactions.

### 17.1 V1 Invoice Timing

**Provisional rule:** invoice is generated after delivery.

This rule must be confirmed with the business before production billing is finalized.

### 17.2 Invoice Contents

An invoice should contain:

- Invoice number
- Customer/business
- Billing information
- Delivery/order reference
- Line items
- Quantity
- Unit
- Unit price
- Subtotal
- Additional charges if applicable
- Total
- Invoice status
- Issue date
- Due date where applicable

### 17.3 Invoice Statuses

Suggested statuses:

- `DRAFT`
- `ISSUED`
- `PAID`
- `OVERDUE`
- `VOID`
- `CANCELLED`

---

## 18. Payments

Payment processing is part of the commercial workflow, but the exact payment provider and method are not yet confirmed.

### 18.1 V1 Rule

Do not hard-code a payment provider until the business confirms the required method.

The system should keep payment integration replaceable.

### 18.2 Payment Integrity

Payment status must be determined from trusted server-side/payment-provider data.

The client must never be allowed to mark an invoice as paid by itself.

---

## 19. Special / Event Orders

Special/event orders are orders requiring advance planning.

The customer should provide:

- Event date
- Products
- Quantities
- Delivery location
- Notes
- Any relevant special requirements

The request enters the normal admin review and quotation process.

Special/event orders require advance notice because availability and preparation may require additional planning.

---

## 20. Cancellation

### 20.1 Before Order Confirmation

A customer may cancel a supply request before it becomes an accepted order.

### 20.2 After Order Confirmation

Once an order is confirmed, cancellation requires admin approval.

### 20.3 Refund Rules

Payment/refund rules are **not yet finalized**.

The application must not invent refund behavior. Final cancellation and refund rules must be confirmed by the business before production billing is considered complete.

---

## 21. Admin Responsibilities

The V1 admin can manage:

- Customers
- Businesses/customer information
- Delivery locations
- Products
- Product pricing
- Supply requests
- Quotes
- Orders
- Invoices

The admin is responsible for reviewing customer requests and confirming commercial terms before an order is created.

---

## 22. Roles

V1 has only two application roles:

### `CUSTOMER`

Can:

- Manage their own account
- Manage their own businesses
- Manage their own locations
- Browse products
- Submit supply requests
- View their requests
- View their quotes
- Accept/reject quotes where permitted
- View their orders
- Manage recurring supply arrangements where implemented
- View invoices

### `ADMIN`

Can:

- View/manage customer records
- Manage products
- Manage pricing
- Review supply requests
- Create/manage quotes
- Manage orders
- Manage invoices
- View relevant operational information

V1 does **not** include separate:

- Farm operator
- Delivery driver
- Accountant
- Super admin

roles.

---

## 23. Security Rules

### 23.1 Server-Side Authorization

Every protected mutation must perform authorization on the server.

Frontend route guards are useful for user experience but are not security boundaries.

### 23.2 Never Trust Client Data

The server must not trust client-provided:

- Role
- User/customer ownership
- Product price
- Order total
- Invoice total
- Quote status
- Order status
- Payment status
- Authorization flags

### 23.3 Sensitive Operations

The following must always be server-controlled:

- Quote creation
- Quote acceptance
- Order creation
- Price calculation
- Invoice creation
- Payment state
- Role checks
- Ownership checks
- Status transitions

---

## 24. Financial Rules

Financial values must be calculated server-side.

Money should not be represented using unsafe floating-point arithmetic for final financial calculations.

Recommended approach:

- Store monetary values as integer minor units where appropriate, or use a database decimal type.
- Calculate totals server-side.
- Preserve transaction prices historically.
- Never calculate the authoritative order total from untrusted client totals.

---

## 25. Status Transition Rules

State transitions must be explicit.

Example quote flow:

`DRAFT → SENT → ACCEPTED`

or:

`DRAFT → SENT → REJECTED`

or:

`DRAFT → SENT → EXPIRED`

An accepted quote must not be accepted again.

Example order flow:

`CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED → COMPLETED`

Cancellation must only be possible from states where cancellation is allowed.

The backend must reject invalid transitions.

---

## 26. Data Integrity

Historical commercial records must remain understandable.

Therefore:

- Do not delete products that are referenced by historical transactions without preserving transaction data.
- Do not change historical quote prices when product prices change.
- Do not allow customer ownership to be changed accidentally.
- Use database relationships and constraints wherever possible.
- Use transactions for multi-record operations that must succeed or fail together.

---

## 27. Notifications

Important workflow events may generate notifications.

Potential events:

- Supply request submitted
- Quote created
- Quote accepted/rejected
- Order confirmed
- Order ready
- Order dispatched
- Delivery completed
- Invoice issued
- Payment received

Exact email provider and notification implementation can be finalized during the implementation phase.

---

## 28. V1 Scope

V1 includes:

- Customer authentication
- Email verification
- Customer/business/location management
- Product catalogue
- Product pricing
- Supply Planner
- Supply request submission
- Customer request history
- Admin request management
- Quote creation
- Customer quote review
- Quote acceptance/rejection
- Order creation
- Customer/admin order management
- Invoice management
- Payment-ready architecture
- Role-based authorization
- Ownership checks
- Validation
- Error/loading/empty/success states
- Responsive UI
- Accessibility
- Production database/authentication/deployment
- Full customer → admin → quote → order workflow testing

---

## 29. V2 Scope

V2 may introduce:

- Dedicated subscription management
- Advanced recurring billing
- Delivery-cycle management
- Growing-cycle management
- Crop allocation
- Production planning
- Demand forecasting
- Demand → growing workflows
- Detailed farm operations
- Advanced special/event-order management
- More granular staff roles
- Delivery operations
- Advanced pricing rules
- Bulk pricing
- Customer-specific pricing
- Location-specific pricing
- Advanced analytics

V2 functionality must not leak into V1 architecture unnecessarily.

---

## 30. Open Business Questions

These must be confirmed before the affected production features are finalized:

1. Which payment provider/method will be used?
2. What are the exact invoice due-date/payment terms?
3. What are the exact cancellation/refund rules after order confirmation?
4. Should subscription billing be generated automatically or handled manually?
5. What exact delivery-cycle rules should eventually be represented in software?
6. What exact special/event-order lead times apply?
7. Are there minimum order quantities for specific products?
8. Are there delivery fees, and if so, how are they calculated?
9. Are taxes/VAT included in displayed prices or added separately?
10. What business/customer verification information is required before accepting a B2B customer?

Until confirmed, the application should use the provisional rules explicitly marked in this document rather than silently inventing behavior.

---

## 31. Change Log

### 2026-09-19 — V1 Working Specification

Established:

- CUSTOMER + ADMIN roles
- Supply request → quote → order workflow
- Quote required before order confirmation
- Server-side price and authorization rules
- Customer-owned businesses and multiple delivery locations
- Standard product pricing
- No V1 quantity/customer/location pricing
- Full-quantity fulfillment by default
- Admin-confirmed delivery dates
- Recurring supply request model
- Provisional post-delivery invoice timing
- Payment provider left unconfirmed
- Cancellation/refund behavior left partially unconfirmed
- V1/V2 scope boundary