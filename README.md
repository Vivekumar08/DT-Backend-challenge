
# API Documentation - DT Backend Challenge Task 2

This API documentation  provides details on the CRUD (Create, Read, Update, Delete) operations for managing nudge events. Nudge events are created by users and include various details such as tagged Event, title, images, Scheduled times, description, icons, and invitation lines. These nudges can be associated with Events.


## Tech Stack


- **Server:** Node.js, Express.js, 
- **Database:** Mongodb
- **ORM:** Mongodb Native Driver


## Object Data Model

Object Data Model for nudge an Event

**tag:** The tag of the event to associate the nudge with.

**title:** The title of the nudge.

**image:** The image file to be used as the nudge cover.

**sendTime:** The time at which the nudge should be sent (format: YYYY-MM-DD HH:mm:ss).

**description:** The description of the nudge.

**icon:** The icon for the nudge.

**invitation:** The one-line invitation for the nudge.

## Operations and API
Base URL: ``` /api/v1/events``` 

1. **Create a Nudge Event**

_Create a new nudge event._

- **HTTP Method:** POST
- **Endpoint:** /nudge
- **Request Body:**
    - Tag Event or Article
    - title
    - image
    - sendTime
    - description
    - icon
    - invitation
- Response:
    - **Status Code:** 200 (Created)
    - **Body:** JSON object containing the created nudge event details, including the nudge ID.

2. **Get Nudge Events**

_Get a list of nudge events._

- **HTTP Method:** GET
- **Endpoint:** /nudge
- **Query Parameters:**
    - **tag** (string, optional): Filter nudge events by tag
    - **limit** (integer, optional): Limit the number of results per page (default: 10).
    - **page** (integer, optional): Retrieve a specific page number (default: 1).
- **Response:**
    - **Status Code:** 200 (OK)
    - **Body:** JSON array containing the list of nudge events.

3. **Get Nudge Event by ID**

_Get a specific nudge event by its ID._

- **HTTP Method:** GET
- **Endpoint:** /nudge/:id
- **Path Parameter:**
    - **id** (string): The ID of the nudge event.
- **Response:**
    - **Status Code:** 200 (OK)
    - **Body:** JSON object containing the nudge event details.

4. **Update a Nudge Event**

_Update an existing nudge event._

- **HTTP Method:** PUT
- **Endpoint:** /nudge/:id
- **Path Parameter:**
    - **id** (string): The ID of the nudge event to update.
- **Request Body:**
    - tag
    - title
    - image
    - sendTime
    - description
    - icon
    - invitation
- **Response:**
    - **Status Code:** 200 (OK)
    - **Body:** JSON object con taining the updated nudge event details.

5. **Delete a Nudge Event**

_Delete a nudge event._

- **HTTP Method:** DELETE
- **Endpoint:** /nudge/:id
- **Path Parameter:**
    - **id** (string): The ID of the nudge event to delete.
- **Response:**
    - **Status Code:** 200 (OK)

That concludes the API documentation for CRUD operations related to nudge events. 