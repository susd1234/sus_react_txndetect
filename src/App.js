import React, { Component } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Papa from "papaparse";

// import { Tab } from "bootstrap";

class App extends Component {
  state = {
    selectedFile: null,
    fileUploadedSuccessfully: false,
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = () => {
    if (this.state.selectedFile) {
      const formData = new FormData();
      formData.append(
        "demo file",
        this.state.selectedFile,
        this.state.selectedFile.name
      );

      // Fixed the axios request by properly handling the response and error.
      axios
        .post(
          // "https://md4mypmtea.execute-api.ap-south-1.amazonaws.com/v1/genai-credit-fraud-detection/input_txn.csv",
          // "https://1wjikouds9.execute-api.ap-south-1.amazonaws.com/v1/s3?key=genai-credit-fraud-detection/Sample_Input_File.csv",
          "https://jenl9gn7dl.execute-api.ap-south-1.amazonaws.com/s3-upld",
          // "https://5e0b4c1bxf.execute-api.ap-south-1.amazonaws.com/GenAI-CreditFraud-lambda1",
          // "https://1wjikouds9.execute-api.ap-south-1.amazonaws.com/v6/s3?key=genai-credit-fraud-detection/put_test_3.csv",
          formData
        )
        .then((response) => {
          // Handle the successful upload here
          this.setState({ selectedFile: null });
          this.setState({ fileUploadedSuccessfully: true });
        })
        .catch((error) => {
          // Handle the error here
          console.error("File upload error:", error);
        });

      // const [records, setRecords] = useState([]);
      // axios
      //   .get(
      //     "https://kxktg7txaf.execute-api.ap-south-1.amazonaws.com/lambda-s3-get"
      //   )
      //   .then((res) => {
      //     setRecords(res.data);
      //   })
      //   .catch((error) => {
      //     // Handle the error here
      //     console.error("File Fetch Error:", error);
      //   });
    }
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details: </h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModified
              ? new Date(this.state.selectedFile.lastModified).toDateString()
              : "N/A"}
          </p>
        </div>
      );
    } else if (this.state.fileUploadedSuccessfully) {
      return (
        <div>
          <br />
          <h4>File has been Successfully Uploaded!!</h4>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose a File and then Press the Upload button</h4>
        </div>
      );
    }
  };

  FetchData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://kxktg7txaf.execute-api.ap-south-1.amazonaws.com/lambda-s3-get"
          );
          const parsedData = Papa.parse(response.data, { header: true });

          setData(parsedData.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, []);

    return (
      <table>
        <thead>
          <tr>
            {data[0] &&
              Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {Object.values(row).map((val) => (
                <td key={val}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // FetchData = () => {
  //   const [records, setRecords] = useState([]);

  //   useEffect = () => {
  //     axios
  //       .get(
  //         "https://kxktg7txaf.execute-api.ap-south-1.amazonaws.com/lambda-s3-get"
  //       )
  //       .then((res) => {
  //         setRecords(res.data);
  //       })
  //       .catch((error) => {
  //         // Handle the error here
  //         console.error("File Fetch Error:", error);
  //       });
  //   };
  //   return (
  //     <div>
  //       <table>
  //         <tbody>
  //           {records.map((r, i) => (
  //             <tr key={i}>
  //               <th>ID</th>
  //               <td>{r.id}</td>
  //               <th>Name</th>
  //               <td>{r.name}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // };

  // FetchData = () => {
  //   const [records, setRecords] = useState([]);

  //   useEffect(() => {
  //     axios
  //       .get(
  //         "https://kxktg7txaf.execute-api.ap-south-1.amazonaws.com/lambda-s3-get"
  //       )
  //       .then((res) => {
  //         setRecords(res.data);
  //       })
  //       .catch((error) => {
  //         // Handle the error here
  //         console.error("File Fetch Error:", error);
  //       });
  //   }, []);

  //   return (
  //     <div>
  //       {records}
  //       <table>
  //         <tbody>
  //           {records.map((r, i) => (
  //             <tr key={i}>
  //               <th>ID</th>
  //               <td>{r.id}</td>
  //               <th>Name</th>
  //               <td>{r.name}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // };

  // export default FetchData;

  //     .catch((err) => console.log(err));
  // }, [])

  render() {
    return (
      <div className="container">
        <h2>File Upload</h2>
        <h3>File Upload with React and AWS Serverless APIs</h3>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload</button>
          {this.state.fileUploadedSuccessfully && <FetchData />}
        </div>
        {this.fileData()}

        {/* <span>{this.FetchData()}</span> */}

        {/* FetchData(this.FetchData) */}
        {/* <FetchData /> */}
      </div>
    );
  }
}

export default App;

// write a function to GET the file from S3 and display it in the browser
//

function FetchData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [content, setContent] = useState(null); // Content to be displayed

  useEffect(() => {
    // Simulate a 5-second wait
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 5 seconds
      setContent("Content to display after 5 seconds");
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clear the timer when the component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a 5-second wait before making the request
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await axios.get(
          "https://kxktg7txaf.execute-api.ap-south-1.amazonaws.com/lambda-s3-get"
        );
        const parsedData = Papa.parse(response.data, { header: true });

        setData(parsedData.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading... Please wait.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                {data[0] &&
                  Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  {Object.values(row).map((val) => (
                    <td key={val}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {content}
        </div>
      )}
    </div>
  );
}

// function FetchData() {
//   const [records, setRecords] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://kxktg7txaf.execute-api.ap-south-1.amazonaws.com/lambda-s3-get"
//         );
//         setRecords(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <br />
//             <th>Name</th>
//           </tr>
//         </thead>
//         <tbody>
//           {records[(0, 10)]}
//           {/* {records.map((record, i) => (
//           <tr key={i}>
//             <td>{record.id}</td>
//             <td>{record.name}</td>
//           </tr>
//           ))} */}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default FetchData;
