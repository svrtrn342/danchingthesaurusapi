var method = Functions.prototype;

var formidable = require("formidable");
var moby = require('moby');

var http = require('http');
var callcount=0;

function Functions(){}


method.querysearch=function(req, res){

	

	
	
    var searchword = "";
    var form = new formidable.IncomingForm();
    var word1 = "";
    var word2 = "";
    var word3 = "";
    var word4 = "";
    try{
        form.parse(req, function (err, fields, files) {
			
			           word1 = "";
					   word2 = "";
					   word3 = "";
					   word4 = "";
					   word1_synonyms=[];
					   word2_synonyms=[];
					   word3_synonyms=[];
					   word4_synonyms=[];
					   is_external=fields.is_external;
					   if(callcount>9998){ 
					   is_external=0;
					   }
					   
			try{
				word1=fields.word1;
			}catch(ex){}	
            try{
				word2=fields.word2;
			}catch(ex){}				
			try{
				word3=fields.word3;
			}catch(ex){}
            try{
				word4=fields.word4;
			}catch(ex){}			
					   
			 /*  
			if(word1.toString().trim()!="")	{	   
			word1_synonyms = moby.search(fields.word1);
			}
			if(word2.toString().trim()!="")	{	
			word2_synonyms = moby.search(fields.word2);
			}
			if(word3.toString().trim()!="")	{	
			word3_synonyms = moby.search(fields.word3);
			}
			if(word4.toString().trim()!="")	{	
			word4_synonyms = moby.search(fields.word4);
			}
			console.log("Word 1 synonyms:");
			console.log(word1_synonyms);
		*/
			

if(is_external==0){ //if call count is over api limit.
	
if(word1 && word1.toString().trim()!=""){
	
word1_synonyms=moby.search(word1);
res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

}else if(word2 && word2.toString().trim()!=""){
	
word2_synonyms=moby.search(word2);
res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

}else if(word3 && word3.toString().trim()!=""){
	
word3_synonyms=moby.search(word3);
res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

}else if(word4 && word4.toString().trim()!=""){
	
word4_synonyms=moby.search(word4);
res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

}
	
	
	
}else{

if(word1 && word1.toString().trim()!=""){
	
	httpRequest(word1.toString().trim()).then(function(results) {
	word1_synonyms=results;

 res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

});
	
}else if(word2 && word2.toString().trim()!=""){
	httpRequest(word2.toString().trim()).then(function(results) {
	word2_synonyms=results;

 res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

});
	
}else if(word3 && word3.toString().trim()!=""){
	httpRequest(word3.toString().trim()).then(function(results) {
	word3_synonyms=results;

 res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

});
	
}else if(word4 && word4.toString().trim()!=""){
	httpRequest(word4.toString().trim()).then(function(results) {
	word4_synonyms=results;

 res.send({ word1_synonyms: [escape(word1),word1_synonyms],word2_synonyms: [escape(word2),word2_synonyms],word3_synonyms: [escape(word3),word3_synonyms],word4_synonyms: [escape(word4),word4_synonyms]});

});
	
}

} // call count is below 9998




// this is a get, so there's no post data


         




         

   



        });

    } catch (ex) {
    }
	


} // function finishes





function httpRequest(word) {
	
	var params = {
    host: 'words.bighugelabs.com',
    method: 'GET',
    path: '/api/2/84e8e61a98af9a38e5c052e79dbcbef4/'+word+"/json"
};
	var results=[];
    return new Promise(function(resolve, reject) {
		
        var req = http.request(params, function(res) {
			callcount++;
			console.log("Api request count: "+ callcount);
            // reject on bad status
			  var body = '';
			
            if (res.statusCode < 200 || res.statusCode >= 300) {
				resolve(results);
               // return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
          
            res.on('data', function(chunk) {
                body+=chunk;
            });
            // resolve on end
            res.on('end', function() {
				
                try {
					
					var jsonobject=JSON.parse(body);

                    for (key1 in jsonobject) {
						
						for(var i=0;i<jsonobject[key1]["syn"].length;i++){
							if(i>=20){break;}
							results.push(jsonobject[key1]["syn"][i]);
						}
					}
					
					

                } catch(e) {
                   // reject(e);
                }
				console.log(results);
				
                resolve(results);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
           // reject(err);
		   resolve(results);
        });

        // IMPORTANT
        req.end();
    });
}

module.exports = Functions;
