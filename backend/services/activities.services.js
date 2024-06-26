const mdb = require("../services/mdb.services");
const { randomUUID } = require('crypto');

/**
 * Create a new act
 * @async
 * @param {Object} body - The body of the request that contains act information
 * @param {String} body.title - The name of the act
 * @param {String} body.email - The email contact for the act
 * @param {String} body.date - The date of the act
 * @param {String} body.organizer - The organizer of the act
 * @param {String} body.userId - A UUID that identifies the user that created the act
 * @return {Object} - An object of {status: status, data: data}, where status can be "OK" or "ERROR" and data is the created act item if OK
 */
exports.addActService = async (params, body) => {
    const actId = randomUUID();
    try {
        const act = await mdb.acts.findOne({ title: body.title });
        if (act) {
            console.log("addUserService Error: Act already exists");
            return { status: "ERROR", data: "Act already exists" };
        }
        const result = await mdb.acts.insertOne({
            actId: actId,
            ...body,
        });        
        await exports.addMemberActService({ actId: actId }, { membershipId: body.userId });
        console.log("addActService Success:", result);
        return { status: "OK", data: body };
    } catch (error) {
        console.log("addActService Error:", error);
        return { status: "ERROR", data: error };
    }
}

/**
 * Get an act by actId
 * @async
 * @param {Object} body - The body of the request that contains act information
 * @param {Object} params - The parameters of the request that contains act information
 * @param {String} params.actId - An UUID that uniquely identifies a act
 * @return {Object} - An object of {status: status, data: data}, where status can be "OK" or "ERROR" and data is the queried act item if OK
 */
exports.getActByIdService = async (params, body) => {
    try {
        const act = await mdb.acts.findOne({ actId: params.actId });
        if (!act) {
            console.log("getActByIdService Error: Act not found")
            return { status: "ERROR", data: "Act not found" };
        }
        console.log("getActByIdService Success:", act);
        return { status: "OK", data: act };
    } catch (error) {
        console.log("getActByIdService Error:", error);
        return { status: "ERROR", data: error };
    }
}

/**
 * Get all acts in the database
 * @async
 * @param {Object} body - The body of the request that contains act information
 * @param {Object} params - The parameters of the request that contains act information
 * @return {Object} - An object of {status: status, data: data}, where status can be "OK" or "ERROR" and data is all act items if OK
 */
exports.getAllActsService = async (params, body) => {
    try {
        const acts = await mdb.acts.find({}).toArray();
        console.log("getAllActsService Success:", acts);
        return { status: "OK", data: acts };
    } catch (error) {
        console.log("getAllActsService Error:", error);
        return { status: "ERROR", data: error };
    }
}

/**
 * Update an act by actId
 * @async
 * @param {Object} body - The body of the request that contains act information
 * @param {Object} params - The parameters of the request that contains act information
 * @return {Object} - An object of {status: status, data: data}, where status can be "OK" or "ERROR" and data is the updated act item if OK
 */
exports.updateActService = async (params, body) => {
    let act = {};
    console.log("updateActByIdService - calling getActByIdService");
    try {
        act = await exports.getActByIdService(params, body);
    } catch (error) {
        console.log("updateActByIdService Error", error);
        return { status: "ERROR", data: error };
    }
    console.log("updateActByIdService", act);
    if (act.status != "OK") {
        return { status: "ERROR", data: act.data };
    }
    if (!act.data) {
        return { status: "ERROR", data: "act does not exist" };
    }

    let query = {
        ...body
    }

    try {
        const result = await mdb.acts.updateOne({ actId: params.actId }, { $set: query });
        console.log("updateActByIdService Success", result);
        return { status: "OK", data: query };
    } catch (error) {
        console.log("updateActByIdService Error", error);
        return { status: "ERROR", data: error };
    }
}

/**
 * Delete a act by actId
 * @async
 * @param {Object} body - The body of the request that contains act information
 * @param {Object} params - The parameters of the request that contains act information
 * @param {String} params.actId - An UUID that uniquely identifies a act
 * @return {Object} - An object of {status: status, data: data}, where status can be "OK" or "ERROR" and data is the deleted act item if OK
 */
exports.deleteActService = async (params) => {
    try {
        const act = await mdb.acts.findOne({ actId: params.actId });
        if (!act) {
            console.log("deleteActByIdService Error: act not found");
            return { status: "ERROR", data: "act not found" };
        }
        const result = await mdb.acts.deleteOne({ actId: params.actId });
        console.log("deleteActByIdService Success:", result);
        return { status: "OK", data: act };
    } catch (error) {
        console.log("deleteActByIdService Error:", error);
        return { status: "ERROR", data: error };
    }
}

/**
 * Add a new member to the specified act
 * NOTE: This needs to be run synchronously/atomically with joinActProfileService, if fails then have to revert both to ensure integrity
 * @async
 * @param {Object} body - The body of the request that contains act information
 * @param {Object} params - The parameters of the request that contains act information
 * @param {String} params.actId - An UUID that uniquely identifies a act
 * @return {Object} - An object of {status: status, data: data}, where status can be "OK" or "ERROR" and data is the updated act item if OK
 */
exports.addMemberActService = async (params, body) => {
    let act = await exports.getActByIdService(params, body);
    if (act.status != "OK") {
        return { status: "ERROR", data: act.data }
    }
    if (!act.data) {
        return { status: "ERROR", data: "act does not exist" }
    }
    if (act.data.membershipIds.includes(body.membershipId)) {
        return { status: "ERROR", data: "membership already exists in act" }
    } else {
        act.data.membershipIds.push(body.membershipId);
    }
    let result = await exports.updateActService(params, act.data);
    if (result.status != "OK") {
        return { status: "ERROR", data: result.data }
    }
}

/**
 * Remove a membership of the specified act
 * @async
 * @param {Object} body - The body of the request that contains act information
 * @param {Object} params - The parameters of the request that contains act information
 * @param {String} params.actId - An UUID that uniquely identifies an act
 * @return {Object} - An object of {status: status, data: data}, where status can be "OK" or "ERROR" and data is the updated act item if OK
 */
exports.removeMemberActService = async (params, body) => {
    let act = await exports.getActByIdService(params, body);
    if (act.status != "OK") {
        return { status: "ERROR", data: act.data }
    }
    if (!act.data) {
        return { status: "ERROR", data: "act does not exist" }
    }
    if (act.data.membershipIds.includes(body.membershipId)) {
        act.data.membershipIds = act.data.membershipIds.filter(id => id != body.membershipId);
    } else {
        return { status: "ERROR", data: "membership doesn't exist in act" }
    }
    let result = await exports.updateActService(params, act.data);
    if (result.status != "OK") {
        return { status: "ERROR", data: result.data }
    }
}
