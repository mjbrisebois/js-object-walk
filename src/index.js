
let debug				= false;

function log ( msg, ...args ) {
    let datetime			= (new Date()).toISOString();
    console.log(`${datetime} [ src/index. ]  INFO: ${msg}`, ...args );
}

function run_replacer ( obj, key, replacer ) {
    let value				= key === undefined // This must be the top parent element
	? obj : obj[key];

    if ( replacer === undefined )
	return value; // Because there's nothing to be done

    if ( typeof replacer !== "function" )
	throw new Error(`Replacer must be a function; not type '${typeof replacer}'`);

    if ( typeof key === "string" || typeof key === "number" ) {
	obj[key]			= replacer.call(obj, key, value );
	return obj[key];
    }
    else if ( key === undefined ) // This must be the top parent element
	return replacer.call(obj, null, value );
    else
	throw new Error(`Unknown key type: ${typeof key}`);
}

// TODO: default to undefined replacer result meaning no replacement, use Symbol for remove
// TODO: an option for width first instead of depth first?
function walk ( parent, replacer, key, depth = 0 ) {
    // If key is undefined than the 'parent' is actually the object we want to start with.
    let value				= run_replacer( parent, key, replacer )

    if ( typeof value !== "object" || value === null ) {
	debug && log("Value is not an object:", value );
	return value;
    }

    debug && log("Walking depth", depth );
    if ( Array.isArray(value) ) {
	debug && log("Walking array with length:", value.length, value );
	for (let i=0; i < value.length; i++) {
	    value[i]			= walk( value, replacer, i, depth+1 );
	}
    }
    else {
	debug && log("Walking object:", value );
	for (let key of Object.keys(value) ) {
	    debug && log("Walk sub-object for key:", key );
	    value[key]			= walk( value, replacer, key, depth+1 );
	}
    }

    return value;
}


// TODO: add method for gathering nodes as a list instead of using callback (eg Object.nodes)


let base_exports = {
    walk,
    logging () {
	debug				= true;
    },
};

module.exports = {
    bindNative() {
	if ( Object.walk !== undefined )
	    throw new Error(`Object.walk is already defined as type: ${typeof Object.walk}`);

	Object.defineProperty(Object, "walk", {
	    "value": function ( ...args ) {
		return walk( ...args );
	    },
	    "writable": false,
	});

	return base_exports;
    },
    ...base_exports
};
