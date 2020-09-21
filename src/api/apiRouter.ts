import express from 'express';

// setup router 
const apiRouter = express.Router();

/** TODO:
 * Implement routing the API calls to the appropriate handler for serving your requests
 * 
 * You may structure and implement this anyway you'd like, both code-wise and in terms of
 * the structure of your directory. 
 * 
 */

// Set up the queries
const db = require('./queries');

// 
// INDEX
// 

// setup main page
apiRouter.get('/', (req, res) => {
   res.send('<h2>Juli Varvarezis - Lead Web Developer Coding Test </h2><h4>Possible URLs: </h4><ul><li>/ticketing </li><li>/ticketing/id_search </li><li>/events </li><li>/events/event_name/event_name_search </li><li>/events/category/category_search </li><li>/events/member_only/member_only_search </li><li>/events/id_search </li><li>/orders/customer_name/customer_name_search/event_id/event_id_search/ticket_type_id/ticket_type_id_search/ticket_quantity/ticket_quantity_search/is_member_purchase/is_member_purchase_search</li></ul>');
});

//
// TICKETING
//

// setup ticketing page
apiRouter.get('/ticketing', db.getTickets);

// setup ticketing page with ticket id
apiRouter.get('/ticketing/:id', db.getTicketById);

// 
// EVENTS
// 

// setup events page
apiRouter.get('/events', db.getEvents);

// setup events page with partial name
apiRouter.get('/events/event_name/:event_name', db.getEventByName);

// setup events page with category
apiRouter.get('/events/category/:category', db.getEventByCategory);

// setup events page with member only
apiRouter.get('/events/member_only/:member_only', db.getEventByMemberOnly);

// setup events page with id
apiRouter.get('/events/:id', db.getEventById);

// 
// ORDERS 
// 

// setup orders page 
apiRouter.get('/orders/customer_name/:customer_name/event_id/:event_id/ticket_type_id/:ticket_type_id/ticket_quantity/:ticket_quantity/is_member_purchase/:is_member_purchase', db.postOrders);

export default apiRouter;