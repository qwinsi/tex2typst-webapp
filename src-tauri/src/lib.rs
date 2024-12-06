use tauri::{AppHandle, Manager};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
/*
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
*/

#[cfg(not(any(target_os = "android", target_os = "ios")))]
fn show_window(app: &AppHandle) {
    let windows = app.webview_windows();

    windows
        .values()
        .next()
        .expect("Sorry, no window found")
        .set_focus()
        .expect("Can't Bring Window to Focus");
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
        let _ = show_window(app);
    }))
    .plugin(tauri_plugin_shell::init())
    // .invoke_handler(tauri::generate_handler![greet])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run_mobile() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    // .invoke_handler(tauri::generate_handler![greet])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

