const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const expect				= require('chai').expect;
const { walk, debug }			= require('../../src/index.js').bindNative();

if ( process.env.LOG_LEVEL )
    debug();


function basic_tests () {
    let input				= [{
	"fruit": {
	    "oranges": 10,
	    "bananas": 4,
	    "apples": 11,
	},
	"candy": [
	    99,
	    33,
	    66,
	    {
		"type": "Tank",
		"name": "Boomer",
		"bytes": new Uint8Array([1,2,3,4]),
	    }
	],
    }];

    it("should collect all keys", async () => {
	let keys			= [];
	let json			= Object.walk( input, function (key, value) {
	    if ( typeof key === "string" )
		keys.push( key );
	    return value;
	});

	expect( keys			).to.deep.equal([ "fruit", "oranges", "bananas", "apples", "candy", "type", "name", "bytes", "0", "1", "2", "3" ]);
    });

    it("should replace Uint8Array", async () => {
	let keys			= [];
	let json			= Object.walk( input, function (key, value) {
	    log.info("Handling key/value: %s => %s", key, typeof value );
	    if ( typeof key === "string" )
		keys.push( key );

	    if ( value instanceof Uint8Array ) {
		return {
		    "type": "Uint8Array",
		    "data": [].slice.call(value),
		};
	    }

	    return value;
	});

	expect( keys			).to.deep.equal([ "fruit", "oranges", "bananas", "apples", "candy", "type", "name", "bytes", "type", "data" ]);
    });
}

describe("Debug", () => {

    describe("Basic", basic_tests );

});
