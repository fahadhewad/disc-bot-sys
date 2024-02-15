using System;
using System.Drawing;
using System.Net.Http;
using System.Windows.Forms;
using System.Runtime.InteropServices;

namespace Troll_Counter

{
    public partial class Form1 : Form
    {
        [DllImport("user32.dll")]
        public static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);
        [DllImport("user32.dll")]
        public static extern bool UnregisterHotKey(IntPtr hWnd, int id);

        const int WM_HOTKEY = 0x0312;
        const uint MOD_ALT = 0x0001;
        const uint VK_F7 = 0x76;
        int hotkeyId = 1; // Unique identifier for your hotkey


        // HttpClient is intended to be instantiated once and re-used throughout the life of an application.
        // Microsoft Docs: https://docs.microsoft.com/en-us/dotnet/api/system.net.http.httpclient
        private static readonly HttpClient client = new HttpClient();

        public Form1()
        {
            InitializeComponent();
            textBox1.Text = "Click the button to send the request";
        }

        private async void send_req_Click(object sender, EventArgs e)
        {
            try
            {
                // Replace with your actual endpoint URL
                string url = "http://localhost:3000/increment";
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode(); // Throw an exception if not successful
                string responseBody = await response.Content.ReadAsStringAsync();

                // Update the TextBox on the UI thread
                textBox1.Invoke(new Action(() => {
                    textBox1.Text = "Counter incremented"; // Or use responseBody for the actual response
                }));
            }
            catch (HttpRequestException ex)
            {
                // Update the TextBox to show the error
                textBox1.Invoke(new Action(() => {
                    textBox1.Text = $"Error: {ex.Message}";
                }));
            }
            catch (Exception ex)
            {
                // General error handling
                textBox1.Invoke(new Action(() => {
                    textBox1.Text = $"An error occurred: {ex.Message}";
                }));
            }
        }

        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);
            if (WindowState == FormWindowState.Minimized)
            {
                Hide(); // Hide the form
                notifyIcon1.Visible = true; // Ensure the tray icon is visible
            }
        }

        private void notifyIcon1_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            Show(); // Show the form
            WindowState = FormWindowState.Normal; // Optionally restore the window state
                                                  // Position the form at the top right of the screen
            this.Location = new Point(Screen.PrimaryScreen.WorkingArea.Width - this.Width,
                                      0);
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            RegisterHotKey(this.Handle, hotkeyId, MOD_ALT, VK_F7); // Register Alt + F7 as global hotkey
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            base.OnFormClosing(e);
            UnregisterHotKey(this.Handle, hotkeyId); // Unregister the hotkey
        }

        protected override void WndProc(ref Message m)
        {
            if (m.Msg == WM_HOTKEY && (int)m.WParam == hotkeyId)
            {
                // Show the form when Alt + F9 is pressed
                this.Show();
                this.WindowState = FormWindowState.Normal;
                this.Location = new Point(Screen.PrimaryScreen.WorkingArea.Width - this.Width, 0); // Position at top right
            }
            base.WndProc(ref m);
        }

    }
}