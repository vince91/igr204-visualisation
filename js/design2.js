var svg = null;
var dataset = null;
var count = 0;
var color_opacity = null;
var dsv = d3.dsv(";", "text/plain");
var currentMousePos = {top:0, left:0}

var question_dic = {
  "Happiness index" :"Y11_Q41",
  "Satisfaction with education": "Y11_Q40a",
  "Satisfaction with present job": "Y11_Q40b",
  "Satisfaction with present standard of living": "Y11_Q40c",
  "Satisfaction with accommodation": "Y11_Q40d",
  "Satisfaction with family life": "Y11_Q40e",
  "Satisfaction with health": "Y11_Q40f",
  "Satisfaction with social life": "Y11_Q40g",
  "Satisfaction with economic situation of the country": "Y11_Q40h"
}

function draw() {
    svg.selectAll(".europe")
       .datum(function(d) { return { countryCode: d3.select(this).attr("id") }})
       .data(dataset, function(d) { return d.countryCode })
       .style("fill", "#004384")
       .style("fill-opacity", function(d) {
            return color_opacity(d.mean);
       });
};

function draw2() {
    svg.selectAll(".europe")
       .datum(function(d) { return { countryCode: d3.select(this).attr("id") }})
       .data(dataset, function(d) { return d.countryCode })
       .style("fill", function(d) {
          if(d.meanMale > d.meanFemale)
            return "#107FC9";
          if (d.meanMale == d.meanFemale)
            return "grey"
          return "#CB5B7C";     
       })
       .style("fill-opacity", 1);
};

function mouse_over() {
    svg.selectAll(".europe")
       .on("mousemove", function(d) {
            $("#country").text(isoCountries[d.countryCode.toUpperCase()]);

            if (d.meanMale)
              $("#mean").text("Male:" + d.meanMale + "; Female:" + d.meanFemale);
            else
              $("#mean").text(d.mean);
            $('#info-container').offset(currentMousePos).show();

            if(!d.mean && !d.meanMale)
              $("#info-container").hide();
       });

    $('.europe').hover(function() {
      $("#info-container").show();
    }, function() {
      $("#info-container").hide();
    })
};

function load_data(theme) {
  var questionCode = question_dic[theme];
  $("h1").text(theme);
  // load csv

  if (questionCode) {

    $('#legend').text('A higher score means happier/more satisfied and it is representated by a darker blue.');
    dsv("data/all_questions.csv", function(d) {
        return {
            countryCode: d.CountryCode.toLowerCase(),
            questionCode: d.question_code,
            subset: d.subset,
            answer: d.answer,
            mean: +d.Mean
        }
    }, function(error, rows) {
        console.log(rows[0]);
        dataset = rows.filter(function(row) {
            return row.questionCode == questionCode;
        });

        color_opacity = d3.scale.linear()
                        .domain(d3.extent(dataset, function(row) {
                            return row.mean;
                        })).range([0.2, 1]);

        var min = d3.min(dataset, function(d) { return d.mean; });
        var max = d3.max(dataset, function(d) { return d.mean; });
        $("#grad1").text(min);
        $("#grad2").text(max);
        var text = "-webkit-linear-gradient(left,rgba(0,67,132,"+color_opacity(min)+"),rgba(0,67,132,"+color_opacity(max)+")";
        $("#gradient").css("background", text);
        $("#gradient-container").show();


        draw();
        mouse_over();

    });
  } else {
    $("#legend").text('Countries are colored in red when women are happier than men, blue when men are happier than women and grey when men and women have the same happiness score.')
    dsv("data/happiness-male-female.csv", function(d) {
      return {
        countryCode: d.CountryCode.toLowerCase(),
        meanMale: d.mean_male,
        meanFemale: d.mean_female
      }
    }, function(error, rows) {
        $("#gradient-container").hide();
      dataset = rows;
      console.log(rows[0]);
      draw2();
    });
  }

}

$(document).ready(function() {

    // add svg to page
    d3.xml("svg/europe.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        $("svg").replaceWith(xml.documentElement);
        svg = d3.select("svg");

        load_data("Happiness index");
        
    });

    // dropdown 
    $(".dropdown li").click(function(e) {
      load_data(e.target.text);
    });

    // mouse position
    $(document).mousemove(function(event) {
        currentMousePos.left = event.pageX - 70;
        currentMousePos.top = event.pageY + 20;
    });

});

var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};