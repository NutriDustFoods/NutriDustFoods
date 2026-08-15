// =====================================================
// FORMAT DATE & TIME
// =====================================================
//
// SQLite CURRENT_TIMESTAMP stores time in UTC.
//
// Nigeria uses:
// Africa/Lagos
// UTC + 1
//
// This function:
// 1. Reads the database timestamp as UTC
// 2. Converts it to Nigeria time
// 3. Displays it in Nigerian format
//
// =====================================================

export function formatDateTime(value) {

    // =================================================
    // EMPTY VALUE
    // =================================================

    if (!value) {

        return "—";

    }


    // =================================================
    // PREPARE DATE VALUE
    // =================================================

    let dateValue =
        String(value).trim();


    // =================================================
    // SQLITE UTC TIMESTAMP
    // =================================================
    //
    // SQLite CURRENT_TIMESTAMP normally returns:
    //
    // 2026-08-15 11:28:52
    //
    // There is no timezone information in that string.
    //
    // We explicitly append "Z" so JavaScript knows
    // that the database value is UTC.
    //
    // =================================================

    if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
            .test(dateValue)
    ) {

        dateValue =
            dateValue.replace(
                " ",
                "T"
            ) + "Z";

    }


    // =================================================
    // CREATE DATE
    // =================================================

    const date =
        new Date(
            dateValue
        );


    // =================================================
    // INVALID DATE
    // =================================================

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    // =================================================
    // FORMAT FOR NIGERIA
    // =================================================

    return date.toLocaleString(
        "en-NG",
        {

            timeZone:
                "Africa/Lagos",

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit",

            hour12:
                true

        }
    );

}