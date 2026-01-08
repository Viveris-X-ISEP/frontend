/**
 * Date utility functions for the application
 */

/**
 * Checks if more than one month has passed between two dates
 * @param dateString - The date string to compare (ISO format)
 * @returns true if more than one month has passed, false otherwise
 */
export function hasOneMonthPassed(dateString: string): boolean {
  try {
    const pastDate = new Date(dateString);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const diffInMs = currentDate.getTime() - pastDate.getTime();

    // Convert to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Consider 30 days as one month
    return diffInDays >= 30;
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
}

/**
 * Checks if more than a specified number of days have passed
 * @param dateString - The date string to compare (ISO format)
 * @param days - Number of days to check
 * @returns true if more than specified days have passed, false otherwise
 */
export function hasDaysPassed(dateString: string, days: number): boolean {
  try {
    const pastDate = new Date(dateString);
    const currentDate = new Date();

    const diffInMs = currentDate.getTime() - pastDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays >= days;
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
}

/**
 * Formats a date string to a human-readable format
 * @param dateString - The date string to format (ISO format)
 * @returns Formatted date string (e.g., "11 décembre 2025")
 */
export function formatDateFr(dateString: string): string {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric"
    };
    return date.toLocaleDateString("fr-FR", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
