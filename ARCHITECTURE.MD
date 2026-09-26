# Upright Cultivate — Application Architecture

**Document:** `ARCHITECTURE.md`  
**Version:** V1  
**Status:** Working architecture specification  
**Last updated:** 2026-09-19

---

## 1. Purpose

This document defines the V1 application structure for Upright Cultivate.

It establishes:

- Application roles
- Route structure
- Navigation
- Core workflows
- V1/V2 boundaries
- Authorization boundaries
- Server/client responsibilities
- Resource ownership
- Major domain relationships

The goal is to keep the application simple enough to ship while providing a clean foundation for future farm operations and commerce features.

---

## 2. Product Definition

Upright Cultivate V1 is a **B2B fresh-produce supply platform**.

The central workflow is:

```text
Customer
   ↓
Browse Products
   ↓
Supply Planner
   ↓
Supply Request
   ↓
Admin Review
   ↓
Quote
   ↓
Customer Acceptance
   ↓
Order
   ↓
Preparation / Growing
   ↓
Delivery
   ↓
Invoice
   ↓
Payment
   ↓
Completed
```

Recurring supply follows:

```text
Customer requests recurring supply
   ↓
Admin reviews
   ↓
Admin confirms schedule
   ↓
Recurring supply arrangement
   ↓
Recurring orders / deliveries
```

V1 is **not** a full farm-management system.

---

## 3. Architecture Principles

### 3.1 Server Is Authoritative

The browser is an interface, not a trust boundary.

The server is responsible for:

- Authentication
- Authorization
- Ownership checks
- Validation
- Business rules
- Price calculation
- Totals
- Status transitions
- Financial state
- Database writes

### 3.2 Business Rules Live Outside UI Components

UI components should collect and display information.

They should not become the authoritative source of business logic.

### 3.3 Validate Twice Where Necessary

Use frontend validation for immediate UX.

Use server-side validation for security and correctness.

Example:

```text
Form
 ↓
Client validation
 ↓
Server Action / Route Handler
 ↓
Schema validation
 ↓
Authorization
 ↓
Business rules
 ↓
Database
```

### 3.4 Preserve Historical Transactions

Product prices and other mutable catalogue information must not rewrite historical quotes, orders, or invoices.

### 3.5 Keep V1 Focused

Do not introduce complex farm-operation abstractions before the underlying business actually requires them.

---

## 4. Technology Boundary

The current application is built around:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion
- Prisma
- PostgreSQL / Supabase
- Authentication
- Zod
- Lucide

The exact implementation details can evolve, but the domain boundaries in this document should remain stable.

---

## 5. Application Roles

V1 contains two roles.

### 5.1 CUSTOMER

A customer can:

- Access their account
- Manage businesses
- Manage delivery locations
- Browse products
- Submit supply requests
- View their requests
- View quotes
- Accept/reject quotes
- View orders
- Manage recurring supply arrangements where implemented
- View invoices

A customer can only access their own resources.

### 5.2 ADMIN

An admin can:

- Manage customers
- Manage customer/business information
- Manage products
- Manage pricing
- Review supply requests
- Create/manage quotes
- Manage orders
- Manage invoices

### 5.3 Roles Intentionally Excluded From V1

Do not create separate roles for:

- Farm operator
- Delivery driver
- Accountant
- Super admin

These can be introduced when actual operational requirements justify them.

---

## 6. Route Architecture

### 6.1 Public Routes

```text
/
 /products
 /supply-planner
```

The homepage already contains the major marketing sections such as:

- Why Us
- Products
- Industries
- Growing System
- Supply Planner
- CTA

Separate pages should only be introduced when they provide a real information or conversion benefit.

---

### 6.2 Authentication Routes

```text
/sign-up
/sign-in
/verify-email
/forgot-password
/reset-password
```

Authentication routes should remain publicly accessible except where a specific action requires authentication.

---

### 6.3 Customer Routes

```text
/dashboard

/dashboard/requests
/dashboard/requests/[id]

/dashboard/quotes
/dashboard/quotes/[id]

/dashboard/orders
/dashboard/orders/[id]

/dashboard/plans
/dashboard/plans/[id]

/dashboard/locations

/dashboard/invoices
/dashboard/invoices/[id]

/dashboard/profile
/dashboard/settings
```

### Customer Navigation

```text
Dashboard

Supply
  Requests
  Quotes
  Orders

Recurring
  Supply Plans

Billing
  Invoices

Business
  Locations
  Profile

Settings
```

Navigation should expose only functionality available to the current customer.

---

### 6.4 Admin Routes

```text
/admin

/admin/requests
/admin/requests/[id]

/admin/customers
/admin/customers/[id]

/admin/products
/admin/products/new
/admin/products/[id]/edit

/admin/pricing

/admin/quotes
/admin/quotes/[id]

/admin/orders
/admin/orders/[id]

/admin/invoices
/admin/invoices/[id]
```

### Admin Navigation

```text
Overview

Commerce
  Requests
  Quotes
  Orders
  Invoices

Catalogue
  Products
  Pricing

Customers
  Customers
```

V2 operational areas should not be presented as fully functional V1 features.

---

## 7. V2 Routes

These routes are intentionally deferred:

```text
/admin/subscriptions
/admin/subscriptions/[id]

/admin/delivery-cycles
/admin/delivery-cycles/[id]

/admin/growing-cycles
/admin/growing-cycles/[id]

/admin/crop-allocation
/admin/crop-allocation/[id]

/admin/production

/dashboard/deliveries

/dashboard/subscriptions
/dashboard/subscriptions/[id]
```

Potential future areas include:

- Production
- Crop allocation
- Growing cycles
- Delivery operations
- Advanced subscriptions
- Recurring billing
- Demand forecasting

---

## 8. Core Domain Model

The core V1 relationship is:

```text
User
 └── Business
      └── DeliveryLocation

User
 └── SupplyRequest
       └── SupplyRequestItem
              └── Product

SupplyRequest
 └── Quote
      └── QuoteItem

Quote
 └── Order
      └── OrderItem

Order
 └── Invoice
```

A recurring arrangement may reference:

```text
Customer
 └── SupplyPlan
      ├── Products
      ├── Quantities
      ├── Frequency
      └── DeliveryLocation
```

The exact Prisma relation names can differ, but the ownership model should remain consistent.

---

## 9. Ownership Model

The primary ownership chain is:

```text
User
 ↓
Business
 ↓
DeliveryLocation
```

Customer-owned commercial records should be traceable back to the customer.

Example:

```text
User
 ↓
Business
 ↓
DeliveryLocation
 ↓
SupplyRequest
 ↓
Quote
 ↓
Order
 ↓
Invoice
```

### Authorization Rule

A customer requesting:

```text
GET /dashboard/orders/123
```

must not simply query:

```text
order.findUnique({ where: { id: "123" } })
```

and return the result.

The query must also establish that the order belongs to the authenticated customer.

Conceptually:

```text
authenticatedUser.id
        ↓
customer ownership
        ↓
order ownership
```

The exact query shape depends on the final Prisma schema.

---

## 10. Authorization Boundary

Every protected server operation follows:

```text
Request
 ↓
Authentication
 ↓
Role check
 ↓
Resource ownership check
 ↓
Input validation
 ↓
Business-rule validation
 ↓
Database operation
```

### Example: Customer Accepts Quote

```text
1. Authenticate user
2. Confirm CUSTOMER role
3. Load quote
4. Confirm quote belongs to authenticated customer
5. Confirm quote is still valid
6. Confirm quote has not already been accepted
7. Create the order
8. Mark quote ACCEPTED
9. Commit the transaction
10. Return result
```

This must happen on the server.

---

## 11. Client vs Server Responsibilities

### Client Responsibilities

The client handles:

- Form presentation
- Input interaction
- Local UI state
- Loading states
- Optimistic UI only where safe
- Immediate validation
- Accessibility
- Error display
- Success feedback

### Server Responsibilities

The server handles:

- Authentication
- Authorization
- Ownership
- Zod/server validation
- Price calculation
- Totals
- Business rules
- Status transitions
- Database writes
- Financial state
- Sensitive operations
- Transaction boundaries

### Never Rely on the Client For

```text
role
userId
customerId
businessId ownership
price
subtotal
total
payment status
quote status
order status
invoice status
```

---

## 12. Server Action / Route Handler Pattern

Use a consistent application-service boundary.

Conceptually:

```text
UI
 ↓
Server Action / Route Handler
 ↓
Schema Validation
 ↓
Authentication
 ↓
Authorization
 ↓
Business Logic
 ↓
Prisma
 ↓
PostgreSQL
```

For complex operations, keep business logic out of page components.

A server-side service/domain layer may be introduced where repeated rules become substantial.

---

## 13. Request → Quote → Order Architecture

These entities represent different stages of the commercial workflow.

### Supply Request

Customer says:

> This is what I want.

It is not yet a confirmed sale.

### Quote

Upright Cultivate says:

> We can supply this under these terms.

The quote contains authoritative pricing and commercial information.

### Order

The customer accepts the quote.

The accepted quote becomes a confirmed order.

Therefore:

```text
SupplyRequest ≠ Order
Quote ≠ Order
```

Do not collapse all three into one model.

---

## 14. Quote Acceptance Transaction

Quote acceptance is a critical transactional operation.

Conceptual flow:

```text
BEGIN TRANSACTION

Verify authenticated customer

Verify quote ownership

Verify quote status

Verify quote validity

Create Order
  ↓
Copy quote line items
  ↓
Copy authoritative prices
  ↓
Calculate/persist order totals

Mark Quote as ACCEPTED

COMMIT
```

If any critical step fails:

```text
ROLLBACK
```

This prevents:

- Accepted quote with no order
- Duplicate orders
- Incorrect totals
- Inconsistent quote/order states

---

## 15. Pricing Architecture

Product catalogue pricing:

```text
Product
 └── Current price
```

Transaction pricing:

```text
QuoteItem
 └── Price captured at quote creation

OrderItem
 └── Price captured from accepted quote

InvoiceItem
 └── Price captured from the commercial transaction
```

Changing the current product price must not alter historical transactions.

V1 does not implement:

- Quantity discounts
- Customer-specific prices
- Location-specific prices
- Advanced bulk pricing

---

## 16. Product Availability Architecture

Availability should be treated separately from product identity and price.

A product can exist even when it cannot currently fulfill a customer's requested quantity.

V1 should allow admin to provide:

- Availability estimate
- Expected delivery date
- Relevant notes

Detailed production allocation belongs to V2.

---

## 17. Delivery Architecture

V1 stores commercially relevant delivery information.

The customer may request:

```text
preferredDeliveryDate
```

but the server/admin determines the confirmed date.

Conceptually:

```text
Customer preferred date
        ↓
Admin review
        ↓
Availability + operational constraints
        ↓
Confirmed delivery date
```

Detailed delivery-cycle scheduling is V2.

---

## 18. Subscription / Recurring Supply Architecture

Recurring supply is a separate concept from a one-time order.

A supply plan represents:

```text
Customer
 + Products
 + Quantities
 + Frequency
 + Location
 + Schedule
 + Status
```

The customer may request a preferred schedule.

Admin confirms the actual recurring arrangement.

V1 should avoid implementing sophisticated automated recurring billing until payment and subscription rules are confirmed.

---

## 19. Invoice and Payment Architecture

Invoice:

```text
Order
 ↓
Invoice
 ↓
Payment
```

Invoice status and payment status must be server-controlled.

The client must never be able to submit:

```text
paymentStatus = "PAID"
```

and have the application trust it.

The exact payment provider is still a business decision.

Therefore:

- Keep payment integration modular.
- Do not tightly couple domain logic to a specific provider.
- Do not finalize provider-specific assumptions before confirmation.

---

## 20. Status Machines

Statuses should be represented explicitly.

### Supply Request

```text
DRAFT
 ↓
SUBMITTED
 ↓
UNDER_REVIEW
 ↓
QUOTED
 ↓
ACCEPTED / REJECTED / CANCELLED
```

### Quote

```text
DRAFT
 ↓
SENT
 ↓
ACCEPTED / REJECTED / EXPIRED / CANCELLED
```

### Order

```text
CONFIRMED
 ↓
PREPARING
 ↓
READY
 ↓
OUT_FOR_DELIVERY
 ↓
DELIVERED
 ↓
COMPLETED
```

Invalid transitions must be rejected by the server.

---

## 21. Database Principles

The database should enforce integrity where practical.

Use:

- Foreign keys
- Unique constraints
- Appropriate indexes
- Required fields
- Enums where appropriate
- Transactions for multi-step operations
- Decimal/integer-safe monetary representation

Do not depend exclusively on application code for fundamental relational integrity.

---

## 22. Historical Data

Historical transactions must remain stable.

For example:

```text
Product price today = ₦5,000/kg
```

does not mean an old quote containing:

```text
₦4,500/kg
```

should change.

Quote/order/invoice line items must preserve their transaction-time values.

---

## 23. Error Handling

Errors should be classified into meaningful categories.

### Validation Error

The submitted data is invalid.

### Authentication Error

The user is not signed in.

### Authorization Error

The user is signed in but cannot perform the operation.

### Not Found

The requested resource does not exist or is intentionally hidden from the user.

### Business-Rule Error

The operation conflicts with the current business state.

Example:

```text
Quote has expired.
```

### System Error

Unexpected server/database failure.

Do not expose sensitive internal errors to customers.

---

## 24. Loading, Empty, Error and Success States

Every major application screen should have intentional states.

### Loading

Used while data is being fetched or an operation is pending.

### Empty

Examples:

- No requests yet
- No quotes yet
- No orders yet
- No invoices yet
- No delivery locations yet

### Error

Explain what happened and provide an appropriate recovery action.

### Success

Confirm completed actions clearly.

Examples:

- Request submitted
- Quote accepted
- Location added
- Profile updated

---

## 25. Route Protection

Protected route groups:

```text
/dashboard/*
/admin/*
```

Customer routes require:

```text
authenticated user
+
CUSTOMER role
```

Admin routes require:

```text
authenticated user
+
ADMIN role
```

Route protection improves UX, but server-side authorization remains mandatory.

---

## 26. V1 / V2 Boundary

### V1

```text
Customer
 ↓
Request
 ↓
Quote
 ↓
Order
 ↓
Invoice
 ↓
Payment
```

### V2

```text
Demand
 ↓
Forecast
 ↓
Production Planning
 ↓
Crop Allocation
 ↓
Growing Cycle
 ↓
Harvest
 ↓
Delivery Cycle
 ↓
Customer Fulfillment
```

The V1 architecture should leave room for this future system without implementing it prematurely.

---

## 27. Recommended Project Structure

A practical structure:

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── public/
│   ├── dashboard/
│   └── admin/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── validation/
│   ├── permissions/
│   ├── pricing/
│   └── utils/
│
├── actions/
│   ├── requests/
│   ├── quotes/
│   ├── orders/
│   ├── invoices/
│   └── locations/
│
├── services/
│   ├── requests/
│   ├── quotes/
│   ├── orders/
│   └── invoices/
│
└── types/
```

This is a starting organization, not a requirement to create every folder immediately.

Avoid creating empty abstraction layers just because they look architecturally complete.

---

## 28. Security Architecture

Minimum V1 security requirements:

- Secure authentication
- Password hashing where credentials are used
- Protected sessions
- Server-side role checks
- Server-side ownership checks
- Server-side validation
- CSRF-safe mutation strategy appropriate to the chosen Next.js mechanism
- Secure cookies where applicable
- No sensitive secrets in client bundles
- No payment secrets in frontend code
- Rate limiting for abuse-prone endpoints where necessary
- Safe error messages
- Database constraints
- Auditability of sensitive admin actions where practical

---

## 29. Authorization Matrix

| Resource | Customer | Admin |
|---|---|---|
| Own profile | Read/Update | Read as needed |
| Own businesses | Read/Update | Manage |
| Own locations | Read/Create/Update | Manage |
| Products | Read | Manage |
| Pricing | Read applicable prices | Manage |
| Own requests | Create/Read/Cancel where allowed | Manage |
| Own quotes | Read/Accept/Reject | Manage |
| Own orders | Read | Manage |
| Own plans | Manage where implemented | Manage |
| Own invoices | Read | Manage |
| Other customer's resources | No | Yes, subject to admin authorization |

This matrix should be reflected in server-side authorization functions.

---

## 30. Core Implementation Rule

Every protected mutation should conceptually look like:

```text
authenticate()
        ↓
authorize()
        ↓
validateInput()
        ↓
loadOwnedResource()
        ↓
validateBusinessState()
        ↓
performMutation()
        ↓
returnSafeResult()
```

Do not allow:

```text
Client
 ↓
Database
```

or:

```text
Client
 ↓
"Trust me, I'm admin"
 ↓
Database
```

---

## 31. Day 2 Deliverables

By the end of Day 2, the repository should contain:

```text
BUSINESS_RULES.md
ARCHITECTURE.md
```

Both documents should be reviewed before database modeling begins.

Checklist:

- [x] Confirm V1 roles
- [x] Define public routes
- [x] Define authentication routes
- [x] Define customer routes
- [x] Define admin routes
- [x] Define navigation
- [x] Define V1/V2 boundary
- [x] Define core workflow
- [x] Define request → quote → order relationship
- [x] Define ownership rules
- [x] Define authorization boundary
- [x] Define client/server responsibilities
- [x] Define major status transitions
- [ ] Confirm remaining business questions
- [ ] Commit architecture documents

---

## 32. Next Step

After these documents are reviewed and committed:

**Day 3 begins with Figma Foundations.**

Day 3 should establish:

- Typography
- Color tokens
- Spacing
- Grid
- Container widths
- Radius
- Shadows
- Form styles
- Button styles
- Layout primitives
- Desktop/mobile foundations

Do not start the Prisma schema until the business rules and architecture have been reviewed.