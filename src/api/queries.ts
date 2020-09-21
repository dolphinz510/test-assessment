import moment from 'moment';
const { Pool, Client } = require("pg");

const pool = new Pool({
	user: "me",
	host: "localhost",
	database: "api",
	password: "password",
	port: "5432"
});

//////////////////////////////////
// INTERNAL FUNCTIONS ////////////
//////////////////////////////////

// default error status and message values
const COMMMON_ERROR_STATUS = 404;
const GENERIC_ERROR_TEXT = "Unable to process request - please contact support";

// send a json error object back to user 
const sendErrorJSON = (res, err, code = COMMMON_ERROR_STATUS, msg = GENERIC_ERROR_TEXT) => {
	console.log(err);
	var errorResponse = {
		"message": msg,
		"developer": {
			"error": err
		}
	};
	res.status(code).send(errorResponse);
};

// send empty json array back to user
const sendEmptyJSON = (res, val = '[]') => {
	console.log('No results found');
	res.status(200).send(val);
};

// function to determine what to do with query result
const buildNext = (res, next = null) => {
	return (err, result)  => {
		console.log(err, result.rows);
		if (err) {
			sendErrorJSON(res, err);
		} else if (!result.rows || result.rows.length == 0) {
			sendEmptyJSON(res);
		} else {
			next ? next(result) : res.status(200).send(result.rows);
		}
	};
};

// check to make sure param name exists in object 
const checkForParams = (param, param_name) => {
	if (param.hasOwnProperty(param_name)) return true;
    else return false;
}

// check to make sure value is an integer
const checkForInt = (num) => {
	const parsed = parseInt(num);
	if (isNaN(parsed)) return false;
	else return parsed;
}

// check to make sure value is a boolean
const checkForBoolean = val => {
	return val === 'false' || val === 'true';
}

//////////////////////////////////
// EXTERNAL FUNCTIONS ////////////
//////////////////////////////////

// get all tickets from db
const getTickets = (req, res, err) => {
	pool.query("SELECT * from tickets ORDER BY id ASC", buildNext(res));
};

// get ticket by id
const getTicketById = (req, res, err) => {
	const check = checkForParams(req.params, 'id');
	if (check) {
		const id = checkForInt(req.params.id);

		if (id) {
			pool.query(`SELECT * from tickets WHERE id = $1`, [id],
				buildNext(res, (result) => {
					console.log("Custom result executing");
					res.status(200).send(result.rows[0]);
				})
			);
		} else {
			sendErrorJSON(res, err);
		}
	} else {
		sendErrorJSON(res, err);
	}
};

// get all events from db
const getEvents = (req, res, err) => {
	pool.query("SELECT * FROM events ORDER BY id ASC", buildNext(res));
};

// get event by name
const getEventByName = (req, res, err) => {
	const check = checkForParams(req.params, 'event_name');
	if (check) {
		const name = (req.params.event_name).trim();

		pool.query(`SELECT * FROM events WHERE event_name ILIKE $1 ORDER BY id ASC`, ['%' + name + '%'], buildNext(res));
	} else {
		sendErrorJSON(res, err);
	}
};

// get event by category
const getEventByCategory = (req, res, err) => {
	const check = checkForParams(req.params, 'category');
	if (check) {
		const cat = (req.params.category).trim();

		pool.query(`SELECT * FROM events WHERE category ILIKE $1 ORDER BY id ASC`, ['%' + cat + '%'], buildNext(res));
	} else {
		sendErrorJSON(res, err);
	}
};

// get event by member only
const getEventByMemberOnly = (req, res, err) => {
	const check = checkForParams(req.params, 'member_only');
	if (check) {
		const member_only = checkForBoolean(req.params.member_only);
		if (member_only) {
			const mo = (req.params.member_only).trim();

			pool.query(`SELECT * FROM events WHERE member_only = $1 ORDER BY id ASC`, [mo], buildNext(res));
		} else {
			sendErrorJSON(res, err);
		}
	} else {
		sendErrorJSON(res, err);
	}
};

// get event by id
const getEventById = (req, res, err) => {
	const check = checkForParams(req.params, 'id');
	if (check) {
		const id = checkForInt(req.params.id);

		if (id) {
			pool.query(`SELECT * from events WHERE id = $1`, [id], 
				buildNext(res, (result) => {
					console.log("Custom result executing");
					res.status(200).send(result.rows[0]);
				})
			);
		} else {
			sendErrorJSON(res, err);
		}
	} else {
		sendErrorJSON(res, err);
	}
};

// post orders
// TODO - add custom error messages
const postOrders = (req, res, err) => {
	// check to make sure all params exist
	const check_for_name = checkForParams(req.params, 'customer_name');
	const check_for_event_id = checkForParams(req.params, 'event_id');
	const check_for_ticket_type_id = checkForParams(req.params, 'ticket_type_id');
	const check_for_ticket_quantity = checkForParams(req.params, 'ticket_quantity');
	const check_for_member = checkForParams(req.params, 'is_member_purchase');

	if (check_for_name && check_for_event_id && check_for_ticket_type_id && check_for_ticket_quantity && check_for_member) {
		// check to make sure values are ints
		const check_event_id = checkForInt(req.params.event_id);
		const check_ticket_type_id = checkForInt(req.params.ticket_type_id);
		const check_ticket_quantity = checkForInt(req.params.ticket_quantity);

		if (check_event_id && check_ticket_type_id && check_ticket_quantity) {
			// check to make sure value is true / false
			const check_member = checkForBoolean(req.params.is_member_purchase);
			if (check_member) {
				console.log('everything passed!!');
				// store variables 
				// would normally do NOW() for date_placed, but want to make sure date matches db
				const date_placed = moment('2020-03-21 08:00:07-05', 'YYYY-MM-DD HH:mm:ss-Z'); // note: months are zero based
				const customer_name = (req.params.customer_name).trim();
				const event_id = parseInt(req.params.event_id);
				const ticket_type_id = parseInt(req.params.ticket_type_id);
				const ticket_quantity = parseInt(req.params.ticket_quantity);
				const is_member_purchase = (req.params.is_member_purchase).trim();

				// get info about event
				const event_info = pool.query(`SELECT * from events WHERE id = ${event_id}`, (err_two, res_two) => {
					console.log(res_two.rows[0]);
					const event = res_two.rows[0];
					const event_start_date = moment(event.start_date, 'YYYY-MM-DD HH:mm:ss-Z');
					const event_end_date = moment(event.end_date, 'YYYY-MM-DD HH:mm:ss-Z');

					// check if date placed is after start time and before end time 
					if (event_start_date.isSameOrBefore(date_placed) && event_end_date.isSameOrAfter(date_placed)) {
						// all good so far
						// check if user needs to be a member
						const event_member_only = event.member_only;
						if (event_member_only == JSON.parse(is_member_purchase)) {
							// all good so far
							// get info about tickets
							const tickets_info = pool.query(`SELECT * from tickets WHERE id = ${ticket_type_id}`, (err_three, res_three) => {
								console.log(res_three.rows[0]);
								const ticket = res_three.rows[0];
								const max_purchasable = ticket.max_purchasable;

								// check if max purchasable is more than ticket quantity
								if (max_purchasable > ticket_quantity) {
									// all good - put in order!
									const text = 'INSERT INTO orders(date_placed, customer_name, event_id, ticket_type_id, ticket_quantity, is_member_purchase) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
									const values = [date_placed, customer_name, event_id, ticket_type_id, ticket_quantity, is_member_purchase];
									
									// run query
									pool.query(text, values, buildNext(res));

								} else {
									console.log('max_purchasable failed');
									sendErrorJSON(res, err);
								}
							});
						} else {
							console.log('event_member_only failed');
							sendErrorJSON(res, err);
						}
					} else {
						console.log('date_placed failed');
						sendErrorJSON(res, err);
					}
				});
			} else {
				console.log('check_member failed');
				sendErrorJSON(res, err);
			}
		} else {
			console.log('check_event_id failed');
			sendErrorJSON(res, err);
		}
	} else {
		console.log('check_for_name failed');
		sendErrorJSON(res, err);
	}
}

module.exports = {
  getTickets,
  getTicketById,
  getEvents,
  getEventByName,
  getEventByCategory,
  getEventByMemberOnly,
  getEventById,
  postOrders
}
