-- Top People
SELECT top 15 DISTINCT "Element", SUM("Mentions") AS "Mentions_SUM", SUM("Impact") AS "Impact_SUM"
FROM "_SYS_BIC"."Summit15.Models/SAP_AN_TWEET" 
WHERE "Type" = 'PERSON'
GROUP BY "Element"
ORDER BY "Mentions_SUM" DESC;

--Top Subjects
SELECT TOP 15 DISTINCT "Element", SUM("Mentions") AS "Mentions_SUM", SUM("Impact") AS "Impact_SUM"
FROM "_SYS_BIC"."Summit15.Models/SAP_AN_TWEET"
WHERE "Type" = 'SOCIAL_MEDIA/TOPIC_TWITTER'
AND "Element" not in (select "term" from "SUMMIT2015"."Summit15.data::cterms")
GROUP BY "Element"
ORDER BY "Mentions_SUM" DESC

INSERT INTO "SUMMIT2015"."Summit15.data::cterms" values ('nairapark')

-- Top Companies Mentioned in the USA
SELECT TOP 15 DISTINCT "Element", SUM("Mentions") AS "Mentions_SUM"
FROM "_SYS_BIC"."Summit15.Models/SAP_AN_TWEET" 
WHERE ("Type" = 'ORGANIZATION/COMMERCIAL'
AND "Element" != 'Amazon'
AND "COUNTRY" IN ('USA', 'United States'))
GROUP BY "Element"
ORDER BY "Mentions_SUM" DESC
