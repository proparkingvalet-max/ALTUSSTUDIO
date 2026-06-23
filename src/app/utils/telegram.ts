/**
 * Utility to send Telegram notifications via the Bot API.
 */
export async function sendTelegramNotification(message: string) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) {
    console.warn("Telegram notification skipped: Bot Token or Chat ID not configured in .env");
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error response:", errorData);
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}
