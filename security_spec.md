# Firebase Firestore Security Specification

This document details the data invariants, test payloads, and security assertions designed to protect the system assets against unauthorized read/write access.

## 1. Data Invariants

1. **Authorization**: Only authenticated users can create orders or quote requests.
2. **PII Restriction**: Users can only read and write their own orders, profile data, or quote requests.
3. **Admin Hierarchy**: Only registered administrators (e.g. `rakhalchandro2@gmail.com`) can read and write all configurations, product tables, and manage client orders or quotes.
4. **Data Integrity**: All written structures (such as Products or Orders) must match their validation schema definitions perfectly. Ghost parameters are rejected.
5. **No Spoofing**: Users cannot declare UIDs differing from their authenticated Firebase Auth UID.

---

## 2. The "Dirty Dozen" Threat Vectors (Secure Payloads Test Matrix)

The following payloads are tested to guarantee they fail securely with `PERMISSION_DENIED`:

1. **Unauthenticated Catalog Insert**: An anonymous guest attempting to write to `/products/{id}`.
2. **ID Spoofing**: An authenticated user attempting to create/update an order record for a different UID.
3. **Admin Spoofing**: A regular customer attempting to write `role: "admin"` in their `/users/{id}` profile.
4. **Site Settings Poisoning**: A customer trying to change `/site_configs/settings` to display malicious titles or banners.
5. **Product Price Fraud**: A customer attempting to edit a product's price or discountedPrice values on the live catalog.
6. **Order Theft**: A customer attempting to query/list alternative customer orders.
7. **Quote Scraping**: Reading other corporate quotation requests.
8. **Invalid Schema Injection**: Writing a product without the required `discountedPrice` or `price` fields.
9. **Spam Fields Injection**: Submitting an order containing ghost fields (e.g., `hackAttemped: true`).
10. **State Skipping**: Trying to mark an order directly as 'Delivered' bypassing 'Shipped' or without matching authorization levels.
11. **Malicious ID Injection**: Creating a document with a 2KB junk string as the document ID.
12. **Malicious Client Timestamping**: Uploading custom future timestamps instead of relying on the backend authority.

---

## 3. Secure Firestore Rules Definition

We will generate `firestore.rules` containing strong attribute checks and write validations.
