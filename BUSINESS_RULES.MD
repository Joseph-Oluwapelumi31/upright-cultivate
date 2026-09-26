# Upright Cultivate — Business Rules

**Document:** `BUSINESS_RULES.md`
**Version:** V1
**Status:** Working specification
**Last updated:** 2026-09-26

---

## 1. Business Overview

Upright Cultivate is a B2B fresh-produce supply business serving commercial customers such as:

* Restaurants
* Hotels
* Cafés
* Retailers / supermarkets
* Catering businesses
* Meal-prep businesses
* Commercial kitchens
* Other approved business customers

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

* Name
* Email address
* Phone number where required
* Password / authentication credentials
* Account status
* Created date
* Updated date

### 2.3 Email Verification

Email verification is required before sensitive customer actions are permitted.

### 2.4 Customer Ownership

A customer may only access and modify resources belonging to their own account or business.

The server must never trust a customer-supplied:

* `userId`
* `customerId`
* `businessId`
* `locationId`
* `orderId`
* `quoteId`
* `invoiceId`

Ownership must be determined and verified server-side.

---

## 3. Businesses

A customer may manage one or more businesses.

A business should contain:

* Business name
* Business type
* Contact information
* Associated customer account
* One or more delivery locations

Supported business types include:

* Restaurant
* Hotel
* Café
* Retail
* Catering
* Meal prep
* Commercial kitchen
* Other

A customer must not be able to access another customer's business.

---

## 4. Delivery Locations

Customers can manage multiple business / delivery locations.

Each location should contain:

* Location name
* Address
* Contact person
* Contact phone
* Optional delivery notes
* Associated business
* Active/inactive state

A supply request, order, and delivery must reference a valid customer-owned location.

Deleting a location that is referenced by historical orders or invoices should not destroy historical records. Prefer deactivation/soft deletion where necessary.

---

## 5. Products

Products are fresh-produce items offered by Upright Cultivate.

Examples include:

* Romaine
* Butterhead
* Kale
* Basil
* Spring onions
* Other approved produce

Each product may have:

* Name
* Description
* Category
* Image
* Active/inactive state
* Unit of sale
* Base price
* Availability information
* Created date
* Updated date

### 5.1 Units

A product may be sold:

* Per kilogram (`kg`)
* Per unit

The unit must be explicitly stored rather than inferred from the product name.

### 5.2 Product Status

Inactive products should not be selectable for new supply requests, while historical records must retain the product information needed to understand previous transactions.

---

## 6. Pricing

### 6.1 Base Pricing

Each product has a standard price according to its configured unit.

Examples:

* ₦X per kg
* ₦X per unit

### 6.2 V1 Pricing Rules

For V1:

* No quantity-based pricing.
* No customer-specific pricing.
* No location-specific pricing.
* No V1 bulk discounts.
* Subscription pricing uses the same product pricing by default.
* Prices are managed by admins.

### 6.3 Historical Pricing

A quote/order/invoice must preserve the price applicable at the time of that transaction.

Changing a product's current price must not silently change an existing quote, order, or invoice.

---

## 7. Product Availability

Product availability may change based on current stock, growing status, or production planning.

### 7.1 Availability Behavior

If the full requested quantity is not currently available:

* V1 waits until the full requested quantity can be supplied.
* Partial fulfillment is not assumed.
* Admin may provide an estimated availability date.

### 7.2 Availability Is Not an Order Confirmation

A product being displayed as available does not by itself create an order.

The customer must complete the supply-request and quotation workflow.

---

## 8. Supply Requests

A supply request represents a customer's intention to purchase produce.

A request may contain:

* Customer/business
* Delivery location
* Requested products
* Quantities
* Units
* Preferred delivery date
* Supply frequency if recurring
* Special/event information where applicable
* Customer notes
* Created date
* Updated date
* Status

### 8.1 Request Statuses

Suggested V1 statuses:

* `DRAFT`
* `SUBMITTED`
* `UNDER_REVIEW`
* `QUOTED`
* `ACCEPTED`
* `REJECTED`
* `CANCELLED`
* `CONVERTED`

Exact enum names may be adjusted during implementation, but transitions must remain explicit.

### 8.2 Submission

A request becomes actionable when the customer submits it.

The server must validate:

* Customer authentication
* Customer ownership
* Product existence
* Product active status
* Valid quantity
* Valid unit
* Valid location
* Required request information

---

## 9. Supply Planner

The public Supply Planner helps a customer describe what they need.

The planner may collect:

* Business type
* Products
* Quantities
* Unit
* Supply frequency
* Delivery location
* Notes
* Special/event information

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
11. An invoice is issued according to the invoice rules in Section 17.
12. Payment is handled according to the payment rules in Section 18.

A customer should not be charged merely because a supply request was submitted.

---

## 11. Quotes

A quote is an offer from Upright Cultivate to supply the requested products under specified commercial terms.

A quote should contain:

* Quote number
* Customer/business
* Delivery location
* Line items
* Product
* Quantity
* Unit
* Unit price
* Line total
* Subtotal
* Additional charges where applicable
* Total
* Estimated availability/delivery information
* Valid-until date where applicable
* Notes
* Quote status
* Created date
* Updated date

### 11.1 Quote Pricing

Quote prices must be captured at quote creation.

Future product-price changes must not modify the quote.

### 11.2 Quote Statuses

V1 quote statuses are:

* `DRAFT`
* `SENT`
* `ACCEPTED`
* `REJECTED`
* `EXPIRED`
* `CANCELLED`

---

## 12. Quote Acceptance

A customer may accept a quote only if:

* The customer is authenticated.
* The quote belongs to the customer.
* The quote is still valid.
* The quote has not already been accepted.
* The quote has not been cancelled or expired.

### 12.1 Acceptance Transaction

Accepting a quote must be handled server-side and atomically.

The operation must:

1. Verify authentication.
2. Verify customer role.
3. Verify quote ownership.
4. Verify quote status.
5. Verify quote validity.
6. Create the order.
7. Create all required order items.
8. Mark the quote as accepted.
9. Commit the transaction.

If the transaction fails, the quote and order must not be left in an inconsistent state.

An accepted quote must not create a second order.

---

## 13. Orders

An order represents a confirmed commercial commitment following quote acceptance.

An order should preserve:

* Order number
* Customer/business
* Delivery location
* Quote reference
* Line items
* Quantities
* Units
* Prices
* Subtotal
* Additional charges
* Total
* Currency
* Delivery information
* Order status
* Created date
* Updated date

### 13.1 Order Statuses

V1 order statuses are:

* `CONFIRMED`
* `PREPARING`
* `READY`
* `OUT_FOR_DELIVERY`
* `DELIVERED`
* `COMPLETED`

The following order flow is the normal progression:

`CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED → COMPLETED`

Invalid transitions must be rejected by the backend.

### 13.2 Order Cancellation

Before order confirmation, a customer may cancel the associated supply request according to Section 20.

Once an order is confirmed, cancellation requires admin approval.

The exact cancellation/refund behavior is not defined as an invoice rule and must not be invented by the application.

---

## 14. Growing / Preparation

When requested products are unavailable, the admin/grower may arrange for the required produce to be grown or prepared before delivery.

For V1, the application does not need to model detailed farm operations.

The platform only needs to retain commercially relevant information such as:

* Availability estimate
* Expected delivery date
* Order status
* Admin notes

Detailed crop production is V2.

---

## 15. Delivery

Deliveries are made according to availability and the operating schedule determined by the business.

### 15.1 Delivery Date

The customer may request a preferred delivery date.

The requested date is **not automatically confirmed**.

The admin/grower confirms the actual delivery date based on:

* Product availability
* Preparation/growing requirements
* Delivery scheduling
* Existing business commitments

### 15.2 Delivery Cycles

For V1, detailed delivery-cycle management is not implemented as a separate operational system.

Admin/grower may use the order's delivery information and internal processes.

A dedicated delivery-cycle management system is planned for V2.

---

## 16. Subscriptions / Recurring Supply

Customers may request recurring supply.

The customer can indicate:

* Preferred frequency
* Products
* Quantities
* Delivery location
* Preferred schedule

Supported frequency concepts include:

* Weekly
* Twice per week
* Multiple times per week
* Not sure / discuss with us

### 16.1 Confirmation

A customer's requested schedule is not automatically confirmed.

Admin/grower reviews the request and confirms the actual recurring arrangement.

### 16.2 Customer Management

V1 should support the intended customer experience for managing recurring supply, including:

* Pause
* Resume
* Cancel
* Change quantity
* Change products
* Change location
* Change frequency

Implementation details may be simplified where necessary to keep V1 within scope.

### 16.3 Pricing

Subscription pricing uses the standard product pricing by default.

No automatic bulk discount is assumed in V1.

---

# 17. Invoices

An invoice is a financial record representing an amount due from a customer for an Order.

An invoice is generated from an existing Order and preserves the commercial values applicable to that transaction.

Invoices are historical financial records and must not silently change when current products, prices, businesses, locations, or orders are modified.

### 17.1 Invoice Relationship to Orders

For V1:

**One Order may have zero or one Invoice.**

An Invoice must belong to exactly one Order.

An Invoice cannot exist without an Order.

The same Order must not have multiple V1 invoices.

The database should enforce the one-to-one relationship where possible.

### 17.2 Invoice Creation

Only an `ADMIN` may create an invoice.

A customer cannot create an invoice.

An invoice may only be created for an existing Order.

The Order must contain the information necessary to generate the invoice.

Invoice creation must use the Order's authoritative server-side financial data.

The client must not be trusted to provide:

* Unit prices
* Line totals
* Subtotal
* Additional charges
* Total
* Invoice status
* Invoice number
* Order ownership
* Authorization information

Invoice creation must be atomic.

If Invoice creation fails, the Invoice must not be partially created.

### 17.3 Invoice Timing

For V1, an invoice is generated **after delivery**.

The Order must have reached `DELIVERED` before an Invoice can be issued.

The application must not automatically issue an invoice merely because:

* a Supply Request was submitted,
* a Quote was created,
* a Quote was accepted,
* an Order was created,
* or an Order entered `PREPARING`.

The exact operational timing of invoice creation after delivery may be initiated by an ADMIN.

### 17.4 Invoice Contents

An invoice should contain:

* Invoice number
* Order reference
* Customer/business
* Delivery location / billing information where applicable
* Line items
* Product name snapshot
* Quantity
* Unit
* Unit price
* Line total
* Subtotal
* Additional charges where applicable
* Total
* Currency
* Invoice status
* Issue date
* Due date

Invoice items must preserve the commercial information required to understand the invoice even if the related Product or Order changes later.

### 17.5 Invoice Item Snapshots

Each invoice item must preserve, at minimum:

* Product reference where appropriate
* Product name snapshot
* Quantity
* Unit
* Unit price
* Line total

Historical invoice presentation must not depend on the current Product name or current Product price.

### 17.6 Invoice Number

Every invoice must have a unique invoice number.

Invoice numbers:

* are generated server-side,
* must be unique,
* cannot be supplied by customers,
* cannot be duplicated,
* must remain unchanged after issuance.

The exact invoice-number format is an implementation/business convention and may be finalized before production deployment.

### 17.7 Invoice Statuses

V1 invoices use exactly these statuses:

* `ISSUED`
* `PAID`
* `OVERDUE`
* `CANCELLED`

A separate `DRAFT` invoice status is not required for V1.

An invoice that has not yet been issued does not need to be represented as a customer-visible invoice.

### 17.8 Invoice Status Transitions

Valid V1 transitions are:

`ISSUED → PAID`

`ISSUED → OVERDUE`

`ISSUED → CANCELLED`

`OVERDUE → PAID`

`OVERDUE → CANCELLED`

`PAID` is terminal.

`CANCELLED` is terminal.

The backend must reject invalid transitions, including:

* `PAID → ISSUED`
* `PAID → OVERDUE`
* `PAID → CANCELLED`
* `CANCELLED → ISSUED`
* `CANCELLED → PAID`
* `CANCELLED → OVERDUE`

An invoice must not be marked as paid more than once.

### 17.9 Invoice Issue Date

An invoice must have an issue date when it becomes `ISSUED`.

The issue date must be assigned server-side.

The customer must not be able to choose or modify the issue date.

### 17.10 Due Date

Every issued invoice must have a due date.

The due date must not be earlier than the invoice issue date.

For V1:

* The ADMIN determines the due date when issuing the invoice.
* The system must not invent a default payment term such as 7, 14, or 30 days unless the business explicitly adopts one.
* The due date is part of the financial terms of the invoice.

Once an invoice has been issued, its due date should be treated as part of the historical invoice record and should not be freely editable.

### 17.11 Overdue Rule

An invoice is considered overdue when:

* the invoice has been issued,
* the invoice remains unpaid,
* and the current date has passed the due date.

Conceptually:

`status = ISSUED AND current date > dueDate → OVERDUE`

The implementation may determine whether this transition is performed through a scheduled process or derived at read time, but the business meaning of `OVERDUE` must remain consistent with this rule.

An invoice must never become `OVERDUE` after it has already been marked `PAID`.

### 17.12 Invoice Editing

Issued invoices are financially immutable.

Once an invoice is issued, the following must not be freely edited:

* Invoice number
* Order reference
* Invoice items
* Product name snapshots
* Quantities
* Units
* Unit prices
* Line totals
* Subtotal
* Additional charges
* Total
* Currency
* Issue date

A paid invoice is completely immutable.

A cancelled invoice is completely immutable.

An overdue invoice cannot have its financial values edited.

If an issued invoice contains an error, the preferred V1 business process is:

**Cancel incorrect invoice → create corrected invoice**

The application must not silently rewrite historical financial information.

### 17.13 Invoice Cancellation

Only an `ADMIN` may cancel an invoice.

An invoice may be cancelled only from:

* `ISSUED`
* `OVERDUE`

A `PAID` invoice cannot be cancelled through the normal V1 invoice workflow.

A `CANCELLED` invoice cannot be restored.

Cancelling an invoice does not automatically:

* cancel the Order,
* change the Order status,
* mark the Order as completed,
* create a refund,
* create a replacement invoice.

Those are separate business operations.

### 17.14 Invoice and Order Independence

Invoice status changes must not automatically change Order status unless a future business rule explicitly defines such behavior.

In particular:

* issuing an invoice does not complete an Order;
* marking an invoice as paid does not automatically complete an Order;
* cancelling an invoice does not automatically cancel an Order.

Order lifecycle and invoice lifecycle remain separate.

### 17.15 Historical Financial Integrity

Once an invoice is issued:

* changing the Product price must not change the Invoice;
* changing the Product name must not change the Invoice;
* changing the Order total must not change the Invoice;
* changing the Business information must not rewrite historical financial values;
* changing the Location information must not rewrite historical financial values.

Invoice snapshots must contain sufficient information to reproduce the commercial contents of the issued invoice.

---

# 18. Payments

Payment processing is part of the commercial workflow, but V1 does not require an integrated payment provider.

### 18.1 V1 Payment Model

For V1, payment confirmation may be performed manually by an ADMIN.

An ADMIN may mark an invoice as `PAID` after confirming that payment has been received through the business's approved payment process.

Customers cannot mark their own invoices as paid.

A client-side action must never be sufficient to establish that payment has occurred.

### 18.2 Payment Provider

The exact payment provider and payment method are not yet finalized.

The V1 application must therefore avoid tightly coupling invoice logic to a specific payment provider.

A future payment integration should be implemented as a separate payment capability rather than changing the meaning of the Invoice itself.

### 18.3 Payment Integrity

Payment state must be determined by trusted server-side information.

The server must verify:

* authentication,
* role,
* invoice ownership where applicable,
* current invoice status,
* valid status transition,
* and any future payment-provider verification.

The client must never be allowed to directly set:

* `PAID`,
* payment amount,
* payment reference,
* payment provider status,
* or other financial authorization fields.

### 18.4 V1 Payment Scope

V1 does not require:

* a Payment model,
* automatic payment reconciliation,
* payment-provider webhooks,
* refunds,
* partial payments,
* installment payments,
* credit notes,
* automated recurring billing.

These may be introduced when the business requirements are finalized.

---

## 19. Special / Event Orders

Special/event orders are orders requiring advance planning.

The customer should provide:

* Event date
* Products
* Quantities
* Delivery location
* Notes
* Any relevant special requirements

The request enters the normal admin review and quotation process.

Special/event orders require advance notice because availability and preparation may require additional planning.

---

## 20. Cancellation

### 20.1 Before Order Confirmation

A customer may cancel a supply request before it becomes an accepted order.

### 20.2 After Order Confirmation

Once an order is confirmed, cancellation requires admin approval.

### 20.3 Invoice Cancellation

Invoice cancellation follows the separate rules defined in Section 17.

Cancelling an invoice does not automatically cancel its associated Order.

### 20.4 Refund Rules

Payment/refund rules are not yet finalized.

The application must not invent refund behavior.

Final cancellation and refund rules must be confirmed by the business before production billing and refund functionality are considered complete.

---

## 21. Admin Responsibilities

The V1 admin can manage:

* Customers
* Businesses/customer information
* Delivery locations
* Products
* Product pricing
* Supply requests
* Quotes
* Orders
* Invoices

The admin is responsible for reviewing customer requests and confirming commercial terms before an order is created.

For invoices, the admin is responsible for:

* creating invoices,
* issuing invoices,
* managing valid invoice status transitions,
* confirming payments in V1,
* cancelling invoices where permitted.

---

## 22. Roles

V1 has only two application roles:

### `CUSTOMER`

Can:

* Manage their own account
* Manage their own businesses
* Manage their own locations
* Browse products
* Submit supply requests
* View their requests
* View their quotes
* Accept/reject quotes where permitted
* View their orders
* Manage recurring supply arrangements where implemented
* View their invoices

Customers cannot:

* Create invoices
* Edit invoice financial values
* Mark invoices as paid
* Cancel invoices
* Change invoice statuses directly

### `ADMIN`

Can:

* View/manage customer records
* Manage products
* Manage pricing
* Review supply requests
* Create/manage quotes
* Manage orders
* Create/manage invoices
* Issue invoices
* Mark invoices as paid
* Mark eligible invoices as cancelled
* View relevant operational information

V1 does **not** include separate:

* Farm operator
* Delivery driver
* Accountant
* Super admin

roles.

---

## 23. Security Rules

### 23.1 Server-Side Authorization

Every protected mutation must perform authorization on the server.

Frontend route guards are useful for user experience but are not security boundaries.

### 23.2 Never Trust Client Data

The server must not trust client-provided:

* Role
* User/customer ownership
* Product price
* Order total
* Invoice total
* Invoice status
* Quote status
* Order status
* Payment status
* Authorization flags

### 23.3 Sensitive Operations

The following must always be server-controlled:

* Quote creation
* Quote acceptance
* Order creation
* Price calculation
* Invoice creation
* Invoice issuance
* Invoice status changes
* Payment state
* Role checks
* Ownership checks
* Status transitions

### 23.4 Invoice Ownership

Customer access to an invoice must be determined through the server-side ownership chain:

**Invoice → Order → Business → User**

A customer must only be able to view invoices belonging to their own Business.

Changing an invoice ID in a URL or request must never allow access to another customer's invoice.

---

## 24. Financial Rules

Financial values must be calculated server-side.

Money must not be represented using unsafe floating-point arithmetic for authoritative financial calculations.

Recommended approach:

* Use database `Decimal` types for monetary values.
* Calculate totals server-side.
* Preserve transaction prices historically.
* Never calculate the authoritative order or invoice total from untrusted client totals.

### 24.1 Quote Financial Invariant

For a quote:

`subtotal = sum(quote item line totals)`

`total = subtotal + additional charges`

where applicable.

### 24.2 Order Financial Invariant

For an order:

`subtotal = sum(order item line totals)`

`total = subtotal + additional charges`

where applicable.

### 24.3 Invoice Financial Invariant

For an invoice:

`subtotal = sum(invoice item line totals)`

`total = subtotal + additional charges`

where applicable.

### 24.4 Historical Financial Values

The authoritative financial values of an issued invoice must not be derived from current Product prices.

The invoice must preserve the financial values that applied to the transaction.

---

## 25. Status Transition Rules

State transitions must be explicit and enforced by the backend.

### 25.1 Quote

Normal flow:

`DRAFT → SENT → ACCEPTED`

or:

`DRAFT → SENT → REJECTED`

or:

`DRAFT → SENT → EXPIRED`

Cancellation is allowed only from states where cancellation is defined.

An accepted, rejected, expired, or cancelled quote must not be accepted again.

### 25.2 Order

Normal flow:

`CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED → COMPLETED`

The backend must reject invalid transitions.

### 25.3 Invoice

Normal flow:

`ISSUED → PAID`

or:

`ISSUED → OVERDUE`

or:

`ISSUED → CANCELLED`

and:

`OVERDUE → PAID`

or:

`OVERDUE → CANCELLED`

`PAID` is terminal.

`CANCELLED` is terminal.

The backend must reject invalid invoice transitions.

### 25.4 Atomic Status Changes

Where a status change is tied to another required database operation, the operation must be transactional.

Status changes must not be performed based solely on client-provided current status.

Where concurrency matters, the server should condition the mutation on the expected current status.

---

## 26. Data Integrity

Historical commercial records must remain understandable.

Therefore:

* Do not delete products that are referenced by historical transactions without preserving transaction data.
* Do not change historical quote prices when product prices change.
* Do not change historical order prices when product prices change.
* Do not change historical invoice prices when product prices change.
* Do not allow customer ownership to be changed accidentally.
* Use database relationships and constraints wherever possible.
* Use transactions for multi-record operations that must succeed or fail together.
* Preserve financial snapshots on quotes, orders, and invoices.
* Protect historical invoices from destructive edits.

### 26.1 Invoice Data Integrity

An Invoice must not exist without an Order.

An Order may have at most one V1 Invoice.

An Invoice must not reference an Order belonging to another customer's Business.

Invoice financial values must be internally consistent.

Invoice numbers must be unique.

---

## 27. Notifications

Important workflow events may generate notifications.

Potential events:

* Supply request submitted
* Quote created
* Quote accepted/rejected
* Order confirmed
* Order ready
* Order dispatched
* Delivery completed
* Invoice issued
* Payment received

Exact email provider and notification implementation can be finalized during the implementation phase.

---

## 28. V1 Scope

V1 includes:

* Customer authentication
* Email verification
* Customer/business/location management
* Product catalogue
* Product pricing
* Supply Planner
* Supply request submission
* Customer request history
* Admin request management
* Quote creation
* Customer quote review
* Quote acceptance/rejection
* Atomic order creation from quote acceptance
* Customer/admin order management
* Invoice creation
* Invoice issuance
* Invoice status management
* Customer invoice viewing
* Manual admin payment confirmation
* Payment-ready architecture
* Role-based authorization
* Ownership checks
* Validation
* Error/loading/empty/success states
* Responsive UI
* Accessibility
* Production database/authentication/deployment
* Full customer → admin → quote → order → delivery → invoice workflow testing

V1 does **not** require:

* Automated payment-provider integration
* Automated recurring billing
* Partial payments
* Installment payments
* Refund processing
* Credit notes
* Multiple invoices per order
* Partial invoicing
* Consolidated invoicing
* Detailed accounting functionality

---

## 29. V2 Scope

V2 may introduce:

* Dedicated subscription management
* Advanced recurring billing
* Delivery-cycle management
* Growing-cycle management
* Crop allocation
* Production planning
* Demand forecasting
* Demand → growing workflows
* Detailed farm operations
* Advanced special/event-order management
* More granular staff roles
* Delivery operations
* Advanced pricing rules
* Bulk pricing
* Customer-specific pricing
* Location-specific pricing
* Advanced analytics
* Payment-provider integrations
* Automated payment reconciliation
* Refund processing
* Credit notes
* Partial payments
* Installment payments
* Multiple/partial invoicing where required

V2 functionality must not leak into V1 architecture unnecessarily.

---

## 30. Open Business Questions

These must be confirmed before the affected production features are finalized:

1. Which payment provider/method will eventually be used?

2. What exact invoice payment terms should the business use?

   * Immediate payment?
   * 7 days?
   * 14 days?
   * 30 days?
   * Customer-specific terms?

3. What are the exact cancellation/refund rules after order confirmation?

4. Should subscription billing be generated automatically or handled manually?

5. What exact delivery-cycle rules should eventually be represented in software?

6. What exact special/event-order lead times apply?

7. Are there minimum order quantities for specific products?

8. Are there delivery fees, and if so, how are they calculated?

9. Are taxes/VAT included in displayed prices or added separately?

10. What business/customer verification information is required before accepting a B2B customer?

11. What exact invoice-number format should be used in production?

Until confirmed, the application must use the explicit V1 rules in this document and must not silently invent additional financial behavior.

---

## 31. Change Log

### 2026-09-26 — Invoice Rules Formalized

Established:

* Invoice belongs to an Order.
* One Order may have zero or one Invoice in V1.
* Invoice creation is ADMIN-only.
* Invoice is generated after delivery.
* Order must reach `DELIVERED` before invoice issuance.
* Invoice financial values are sourced from authoritative Order data.
* Invoice items preserve historical product/price snapshots.
* Invoice number is server-generated and unique.
* V1 invoice statuses are `ISSUED`, `PAID`, `OVERDUE`, and `CANCELLED`.
* Invoice status transitions are explicitly defined.
* `PAID` and `CANCELLED` are terminal states.
* Issued invoices are financially immutable.
* Incorrect issued invoices should be cancelled and corrected through a new invoice rather than silently edited.
* Due dates are required for issued invoices.
* Due-date payment terms remain a business decision and must not be invented by the application.
* Overdue means an issued, unpaid invoice has passed its due date.
* V1 allows manual ADMIN payment confirmation.
* Customers cannot mark invoices as paid.
* V1 does not require a Payment model or payment-provider integration.
* Invoice cancellation does not automatically cancel or modify an Order.
* Payment/refund behavior remains intentionally limited until finalized.
* Historical invoice financial integrity is mandatory.
* Invoice ownership follows `Invoice → Order → Business → User`.
* Invoice financial invariants are explicitly defined.
* V1 excludes partial invoicing, multiple invoices per order, refunds, credit notes, installment payments, and automated payment processing.

### 2026-09-19 — V1 Working Specification

Established:

* CUSTOMER + ADMIN roles
* Supply request → quote → order workflow
* Quote required before order confirmation
* Server-side price and authorization rules
* Customer-owned businesses and multiple delivery locations
* Standard product pricing
* No V1 quantity/customer/location pricing
* Full-quantity fulfillment by default
* Admin-confirmed delivery dates
* Recurring supply request model
* Provisional post-delivery invoice timing
* Payment provider left unconfirmed
* Cancellation/refund behavior left partially unconfirmed
* V1/V2 scope boundary
