-- Authorize SYSTEM user to New Components

call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('Summit15.data::summit15', 'SYSTEM');


-- Create FT Index Tweets
CREATE FullText INDEX "TWEETS" ON "SUMMIT2015"."Summit15.data::tweets" ("Text") 
LANGUAGE COLUMN "Language"
TEXT ANALYSIS ON
TEXT MINING ON
CONFIGURATION 'EXTRACTION_CORE';


-- Create FT Index Tweets Brands
CREATE FullText INDEX "TWEETSB" ON "SUMMIT2015"."Summit15.data::tweetsb" ("Text") 
LANGUAGE COLUMN "Language"
TEXT ANALYSIS ON 
TEXT MINING ON
CONFIGURATION 'EXTRACTION_CORE_VOICEOFCUSTOMER';


-- Create FT Index Tweets Location Brands
CREATE FullText INDEX "LOCATIONB" ON "SUMMIT2015"."Summit15.data::tweetsb" ("Location") 
LANGUAGE COLUMN "Language"
TEXT ANALYSIS ON 
CONFIGURATION 'EXTRACTION_CORE';

-- Create FT Index Tweets Location 
CREATE FullText INDEX "LOCATION" ON "SUMMIT2015"."Summit15.data::tweets" ("Location") 
LANGUAGE COLUMN "Language"
TEXT ANALYSIS ON 
CONFIGURATION 'EXTRACTION_CORE';

-- Create FT Index Tweets Brands
CREATE FullText INDEX "SAPB1TWEETS" ON "SUMMIT2015"."Summit15.data::sapb1tweets" ("Text") 
LANGUAGE COLUMN "Language"
TEXT ANALYSIS ON 
TEXT MINING ON
CONFIGURATION 'EXTRACTION_CORE_VOICEOFCUSTOMER';


-- Create FT Index Tweets Location Brands
CREATE FullText INDEX "SAPB1LOCATION" ON "SUMMIT2015"."Summit15.data::sapb1tweets" ("Location") 
LANGUAGE COLUMN "Language"
TEXT ANALYSIS ON 
CONFIGURATION 'EXTRACTION_CORE';


