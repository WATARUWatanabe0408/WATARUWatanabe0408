function coubicSearch() {
  // 検索条件に該当するスレッド一覧を取得
  const threads = GmailApp.search('subject:[STORES 予約] 予約が入りました　-label:予約メール転記済み');
  
  // スレッドを一つずつ取り出す
  threads.forEach(function(thread) {
    // スレッド内のメール一覧を取得
    const messages = thread.getMessages();
    
    // メールを一つずつ取り出す
    messages.forEach(function(message) {
      const plainBody = message.getPlainBody();
      const reserveContent = plainBody.match(/◆予約内容:[\s\S]*?◆/);
      const reserverDetail = plainBody.match(/◆予約者[\s\S]*?◆/);
      const reserveDate = plainBody.match(/◆予約日時:[\s\S]*?◆/);
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('coubic予約');
      const lastRow = sheet.getRange(sheet.getMaxRows(), 2).getNextDataCell(SpreadsheetApp.Direction.UP).getRow()+1; // https://moripro.net/gas-get-specified-lastcol-lastrow/
      
      let reserver = reserverDetail[0]
                      .replace('◆予約者:\r\n  ','')
                      .replace('\r\n  ',',')
                      .replace('\r\n  ',',')
                      .replace('\r\n  ',',')
                      .replace('\r\n  ',',')
                      .replace('\r\n\r\n◆','');

      reserver = "'"+reserver+"'";
      reserver = reserver.split(",");
      
      const reserveName = reserver[0].replace("'",'');
      const mailAddress = reserver[1];
      const telNum = reserver[2];
      const reserveInfoDetail = reserver[3].replace("'",'')
      
      // セルを取得して値を転記
      sheet.getRange(lastRow, 2).setValue(reserveContent[0].replace('◆予約内容:\r\n  ','').replace('\r\n\r\n◆',''));
      sheet.getRange(lastRow, 3).setValue(reserveName);
      sheet.getRange(lastRow, 6).setValue(mailAddress);
      sheet.getRange(lastRow, 5).setValue(telNum);
      sheet.getRange(lastRow, 7).setValue(reserveInfoDetail);
      sheet.getRange(lastRow, 4).setValue(reserveDate[0].replace('◆予約日時:\r\n  ','').replace('\r\n\r\n\r\n\r\n◆',''));
    });
    
    // スレッドに処理済みラベルを付ける
    const label = GmailApp.getUserLabelByName('予約メール転記済み');
    thread.addLabel(label);
  });
}