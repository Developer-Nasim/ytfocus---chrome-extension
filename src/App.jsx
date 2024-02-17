import { useEffect, useState } from 'react' 
import './App.css'

function App() { 

 
  const [related, setrelated] = useState(false)
  const [hider, sethider] = useState(false)

  useEffect(() => {
    CheckAndUpdate()
    async function CheckAndUpdate() { 
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
  
      chrome.scripting.executeScript({
        target: { tabId: tab.id }, 
        func: () => {   
          return {
            showhide: document.querySelector('body').classList.contains('rest_hidden'),
            rel: document.querySelector('body').classList.contains('showed_related'),
          };
        },
      },(result) => {
          const data = result[0].result; // Retrieve the returned data
          setrelated(data.rel)
          sethider(data.showhide)
      })
  
    }
  },[])


  // Exsicutble codes for the tab
  async function HideContent(val = true) { 
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args:[val],
      func: (val) => {
        const Related = document.querySelector('ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer')
        if (val) {
          Related.style.display = "none"
          document.querySelector('body').classList.add('rest_hidden')
        }else{
          Related.style.display = "block"
          document.querySelector('body').classList.remove('rest_hidden')
        }
        
        return true;
      },
    })

  }
  async function ShowRelated(val = true) {
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args:[val],
      func: (val) => {
        const ChipItems = document.querySelectorAll('#chips yt-chip-cloud-chip-renderer')
        const RightArrow = document.querySelector('#right-arrow')
        const LeftArrow = document.querySelector('#left-arrow')
        if (val) {
          ChipItems.forEach(item => {
            const Content = item.outerText.toLowerCase()
            if (Content == 'related') {
              item.click()
            } 
            RightArrow.click()
          }) 
          document.querySelector('body').classList.add('showed_related')
        }else{
          ChipItems.forEach(item => {
            LeftArrow.click()
          })
          ChipItems[0].click()
          document.querySelector('body').classList.remove('showed_related')
        }
        
        return true;
      },
    })

  }


  const OnlyRelated = () => {
    setrelated(!related)
    ShowRelated(!related)
  }
  const HideRest = () => {
    sethider(!hider)
    HideContent(!hider)
  }



  return (
    <>  
      <div className="activateNow">
          <h5>YtFocus</h5>
          <div>
            <button type='button' onClick={OnlyRelated} className={related && "active"}><span></span> {related && "Showing"} Related Contents Only</button>
            <button type='button' onClick={HideRest} className={hider && "active"}><span></span> {hider ? "Show": "Hide"} Rest Contents</button>
          </div>
          <p>Made with ❤️ by <a href="//linkedin.com/in/amiruzzaman-nasim" target='_blank'>Amirruzzaman</a></p>
      </div> 
    </>
  )
}

export default App
