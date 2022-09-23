
const DELETE				= Symbol();
let debug				= false;

function log ( msg, ...args ) {
    let datetime			= (new Date()).toISOString();
    console.log(`${datetime} [ src/index. ]  INFO: ${msg}`, ...args );
}

function run_replacer ( obj, key, path, replacer ) {
    let value				= key === undefined // This must be the top parent element
	? obj : obj[key];

    if ( replacer === undefined )
	return value; // Because there's nothing to be done

    if ( typeof replacer !== "function" )
	throw new Error(`Replacer must be a function; not type '${typeof replacer}'`);

    if ( key === undefined ) // This must be the top parent element
	return replacer.call(obj, null, value, path.slice() );
    else if ( typeof key === "string" || typeof key === "number" )
	return replacer.call(obj, key, value, path.slice() );
    else
	throw new Error(`Unknown key type: ${typeof key}`);
}

// TODO: an option for width first instead of depth first?
function walk ( parent, replacer, key, path ) {
    if ( path === undefined )
	path				= [];

    if ( key !== undefined ) {
	debug && log(`Extending path (${path.length}) with:`, key, path );
	path.push( String(key) );
    }

    // If key is undefined than the 'parent' is actually the object we want to start with.
    let value				= run_replacer( parent, key, path, replacer )

    if ( typeof value !== "object" || value === null ) {
	debug && log("Value is not an object:", value );
	return value;
    }

    debug && log("Walking depth", path.length, path );
    if ( Array.isArray(value) ) {
	debug && log("Walking array with length:", value.length, key );
	for (let i=0; i < value.length; i++) {
	    const new_value		= walk( value, replacer, i, path );

	    if ( new_value === DELETE ) {
		value.splice(i, 1);
		i--;
	    }
	    else if ( new_value !== value[i] )
		value[i]		= new_value;

	    debug && log(`Removing path segment (${path.length-1}):`, path[path.length-1] );
	    path.pop();
	}
    }
    else {
	debug && log("Walking object:", value );
	for (let key of Object.keys(value) ) {
	    debug && log("Walk sub-object for key:", key );
	    const new_value		= walk( value, replacer, key, path );

	    if ( new_value === DELETE )
		delete value[key];
	    else if ( new_value !== value[key] )
		value[key]		= new_value;

	    debug && log(`Removing path segment (${path.length-1}):`, path[path.length-1] );
	    path.pop();
	}
    }

    return value;
}


// TODO: add method for gathering nodes as a list instead of using callback (eg Object.nodes)


let base_exports = {
    walk,
    DELETE,
    logging () {
	debug				= true;
    },
};

module.exports = {
    bindNative() {
	if ( Object.walk !== undefined )
	    throw new Error(`Object.walk is already defined as type: ${typeof Object.walk}`);

	Object.defineProperty(Object, "walk", {
	    "value": walk,
	    "writable": false,
	});

	return base_exports;
    },
    ...base_exports
};
