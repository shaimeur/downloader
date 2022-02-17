const http = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const puppeteer = require("puppeteer");
const cookies = require("./cookies");
const path = require("path");
const { resolve } = require("path");
const { rejects } = require("assert");
const Cookie = `__ssid=60ceae4b-4e38-457a-a629-7b0340035858 ;_gcl_au=1.1.1871281891.1636544504 ;_guid=8526cd2d-ceaf-466f-9bd4-b43bb63b2b0e ;AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19039%7CMCMID%7C33307845254433757334677520206068160348%7CMCOPTOUT-1644942659s%7CNONE%7CvVersion%7C5.1.1 ;AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1 ;AnalyticsSyncHistory=AQJoTRk-9S9KWgAAAX71H2GdFZ7zgomFE2YXPIf6suHs90qea5TeVm7FfZLz6GCea2ggOFpiaHzaNy-KpW7aNw ;bcookie="v=2&1d33d810-3049-4b48-894b-8b86663e5164" ;dfpfpt=9894f6bb13a04bd7b6cdb7763fdc63b2 ;fptctx2=taBcrIH61PuCVH7eNCyH0AEX4aYkgtBfv7X8PIbvtOCMkwFL%252bSid3xgpK91Fnnfi1gip0EpUvMhHw64%252fNVjBelUirp6saLLbwHylhIBjmJts3uFFAWx14xC9r3UvCJ6BBjLXaefWelybLaB%252bwriN77LBPRWk1x%252fbfRng%252b4kQk%252f9kJPlURazJCjM3zNixPmMxAssoqwAXZZQoln3LFme3W0Kuel1Bc9jizZHgaJSToj8AR68AldasjMjuKTJZAIQtIibVXzJJfwsVTOm8VYgirEHuM9kk6ezHTto4jkGTIvdK0iC3Y%252bNfQdyMaTv4PkFh ;gpv_pn=www.linkedin.com%2Flearning%2Fspring-spring-mvc-2%2Fspring-mvc-for-robust-applications ;lang=v=2&lang=en-us ;li_mc=MTsyMTsxNjQ0OTMxNzk5OzE7MDIxLi/UECQF9pRDjqZyRjdWZwmNUvAZxpVPdC1mKUwGNh4= ;li_sugr=95ac968e-9a69-459d-a78c-98e270ddfc47 ;liap=true ;lidc="b=TGST02:s=T:r=T:a=T:p=T:g=2712:u=1:x=1:i=1644934388:t=1645020788:v=2:sig=AQE1mAdBh4PCj6-hFp14utLqINSDbPPg" ;lms_ads=AQG_jBulLxaUOAAAAX71H2KmDbaW-M8uAylsgWlnmufdRM-C4-ROVmLZ4uzk3GtYeG1VY8iJ792RPHRjB3aT1X94s5oPecLb ;lms_analytics=AQG_jBulLxaUOAAAAX71H2KmDbaW-M8uAylsgWlnmufdRM-C4-ROVmLZ4uzk3GtYeG1VY8iJ792RPHRjB3aT1X94s5oPecLb ;s_cc=true ;s_fid=2E7987106525209F-1A8F89AD9FE2A5EA ;s_ips=933 ;s_plt=4.10 ;s_pltp=www.linkedin.com%2Flearning%2Fspring-spring-mvc-2%2Fspring-mvc-for-robust-applications ;s_ppv=www.linkedin.com%2Flearning%2Fspring-spring-mvc-2%2Fspring-mvc-for-robust-applications%2C100%2C100%2C933%2C1%2C1 ;s_sq=%5B%5BB%5D%5D ;s_tp=933 ;s_tslv=1644935459879 ;sdsc=22%3A1%2C1644931983997%7ECONN%2C0gFvKmNA%2BLd17kq5TvietyE1lhB8%3D ;UserMatchHistory=AQIVwl1yAwoZ9gAAAX79lnVIps9_Pkx0sMrfweLKLjxqe1k7Spjs87qSvU2BUHkDHup6ROVL2pYSnon7nbzkbCoW6b_KQqoqfnVl_vfDI9St-0hn7Qhx2f5KjP35VMGvplAAsIn4CebFwjetKwldTOjvudu194hSRJUTZe7XGvmTmRw0nAIhFZBYo6bGu-4x51zTGgTTqaQbkgThjMhsy8oaIcpIxFKj5KAifBoHUdlLe0PaCnyLcNA74rseNAJY9Wdn94c5AxWk3t2IC9cfhrJx1oFIpN7BJceGnLo ;bscookie="v=1&2021101212103239c867a3-12ee-4628-84d5-5bb493210cb9AQGaW_LjfYsrl7FyKUwzYWxRozPN7QHL" ;JSESSIONID="ajax:8354134475605925388" ;li_at=AQEGAGMBAAAAAAcgu9YAAAF-_Zey2AAAAX8hpDbYTQAARnVybjpsaTplbnRlcnByaXNlUHJvZmlsZToodXJuOmxpOmVudGVycHJpc2VBY2NvdW50Ojk1MjMxNDczLDE1NjY1ODYxNCnKkXZ4VYbaniq96zWfF1N7hoBhBz-8Ops3OOr7I-WDkYX-Fk5XmXOV_BOrNU3wLfCe8vM4J-zbLX7JLvhFQHatHpFWPS07q30AriZbfYhdeslhmio ;li_ep_auth_context=AFBhcHA9bGVhcm5pbmcsYWlkPTk1MjMxNDczLGlpZD0xMTEyMjQ0MTcscGlkPTE1NjY1ODYxNCxleHA9MTY1MDExNjA4NDQ2MyxjdXI9dHJ1ZQHYAMOmxRRCqMFjJLYE9DBl3om_sQ ;li_rm=AQFI1XYaKFBnsgAAAXx0a1spLVX4tvFQTdbOsNMo2S_K4p4gDjsGSgDxcm328q7aTykReCZOtTgv0qaG05zOeC68LNL7XToyDmquIDRONYVoXYlfaLZj_BZF ;li_theme=light ;li_theme_set=app ;spectroscopyId=9a75992c-ff90-433c-bded-477c427ae846 ;timezone=Africa/Casablanca ;g_state={"i_l":0} ;lil-lang=en_US ;PLAY_LANG=en ;PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiJkMGIzZWIwOC0wNmM2LTRkYTItYjFhOS1kYThiMzgzYzdhN2R8MTY0NDUwNzA3NyIsImFsbG93bGlzdCI6Int9IiwicmVjZW50bHktc2VhcmNoZWQiOiIiLCJyZWZlcnJhbC11cmwiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20vcHJlbWl1bS9wcm9kdWN0cy8_ZmFtaWx5PWpzcyZtaWRUb2tlbj1BUUZNOVlRQXNvR0ozUSZtaWRTaWc9MUZJWFg1NDlzUlRxNDEmdHJrPWVtbC1lbWFpbF9qb2JfYWxlcnRfZGlnZXN0XzAxLWpvYl9hbGVydC0xMi1wcmVtaXVtX3Vwc2VsbF90b3BfYXBwbGljYW50X21lcmNhZG8mdHJrRW1haWw9ZW1sLWVtYWlsX2pvYl9hbGVydF9kaWdlc3RfMDEtam9iX2FsZXJ0LTEyLXByZW1pdW1fdXBzZWxsX3RvcF9hcHBsaWNhbnRfbWVyY2Fkby1udWxsLThyM21oYiU3RWt5dTBkejBqJTdFZnItbnVsbC1uZXB0dW5lJTJGcHJlbWl1bSUyRXByb2R1Y3RzIiwiUk5ULWlkIjoifDAiLCJyZWNlbnRseS12aWV3ZWQiOiIiLCJDUFQtaWQiOiLClTdWwojCjcKHSS3Cklx1MDAxQirCulNYwotVIiwiZXhwZXJpZW5jZSI6IiIsInRyayI6IiJ9LCJuYmYiOjE2NDQ1MDcwNzcsImlhdCI6MTY0NDUwNzA3N30.Wq6wATsIk2MzOhaPqGtDqj9rfqOcTAn1wh7DfL3kXcU ;visit=v=1&M`;
const course =
  "https://www.linkedin.com/learning/learning-docker-2018/why-create-containers-using-docker";

function pipeIt(videoLink, file) {
  return new Promise((resolve, reject) => {
    const request = http.get(videoLink, function (response) {
      response.pipe(file);
      resolve();
    });
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(course);
  page.setCookie(...cookies);
  /*

    playlist = [{
        //sections
        name,
        lectures:[
            { // lecture
                title;
                page
            }
        ]
    }]

  */
  const playlist = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".toc-section")).map(
      (section) => ({
        name: section.querySelector("button").textContent.trim(),
        lectures: Array.from(section.querySelectorAll(".toc-item")).map(
          (lecture) => ({
            title: lecture
              .querySelector(".table-of-contents__item-title")
              .textContent.trim(),
            page: lecture.querySelector("a").href,
          })
        ),
      })
    );
  });
  //   somelecture = playlist[0].lectures[0].page;
  //   await page.goto(somelecture);
  //   const videoLink = await page.evaluate(
  //     () => document.querySelector("video").src
  //   );
  //   console.log("link ", videoLink);
  baseDir = path.join(__dirname, "docker course");
  if (!fs.existsSync(baseDir)) {
    console.log("creating baseDir dir");
    fs.mkdirSync(baseDir);
  }
  console.log("downloading.....");
  for (section of playlist) {
    console.log(`download ${section.name} - ${section.lectures.length}`);
    const sectionPath = path.join(
      baseDir,
      section.name.replace(/[/\\?%*:|"<>]/g, "-")
    );
    console.log(`sectionPAth - ${sectionPath}`);
    if (!fs.existsSync(sectionPath)) {
      console.log("creating dir");
      fs.mkdirSync(sectionPath);
    }
    console.log("downloading lectures of " + section.name);
    for (lecture of section.lectures) {
      console.log("downloading lecture " + lecture.title);
      const filePath = path.join(
        sectionPath,
        lecture.title.replace(/[/\\?%*:|"<>]/g, "-") + ".mp4"
      );
      console.log("filePAth " + filePath);
      const file = fs.createWriteStream(filePath);
      console.log("creating of file");
      await page.goto(lecture.page);
      const videoLink = await page.evaluate(
        () => document.querySelector("video").src
      );
      console.log("videoLink " + videoLink);
      await pipeIt(videoLink, file);
      console.log("video Downloaded 🙌");
      //   const request = http.get(videoLink, function (response) {
      //     response.pipe(file);
      //   });
    }
  }
  //   await browser.close();
})();
