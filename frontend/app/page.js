// 'use client'; // Mark this as a Client Component

// import { useState, useEffect } from 'react';
// import { Chart } from 'react-chartjs-2'; // Import Chart.js

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,  // Import LinearScale for numerical data
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'; // Import the required components
// p
// // Register components
// ChartJS.register(
//   CategoryScale, 
//   LinearScale,  // Register LinearScale
//   BarElement, 
//   Title, 
//   Tooltip, 
//   Legend
// );


// export default function Home() {
//   const [file, setFile] = useState(null);
//   const [jobId, setJobId] = useState(null);
//   const [stats, setStats] = useState(null); // State for stats
//   const [loading, setLoading] = useState(false); // State for loading
//   const [progress, setProgress] = useState(0); // State for job progress
//   const [status, setStatus] = useState(''); // State for job status

//   // Handle file upload
//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append('logFile', file);

//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:3000/api/upload-logs', {
//         method: 'POST',
//         body: formData,
//       });
            
//       if (!response.ok) {
//         throw new Error('Failed to upload file');
//       }
  
//       const { jobId } = await response.json();
//       setJobId(jobId);
//     } catch (error) {
//       console.log('Error uploading file:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//  // Fetch stats for the uploaded file
//  useEffect(() => {
//   if (jobId) {
//     console.log('Fetching stats for jobId:', jobId); // Debugging line
//     const fetchStats = async () => {
//       const response = await fetch(`http://localhost:3000/api/stats/${jobId}`);
//       const data = await response.json();
//       console.log('Fetched stats:', data); // Log fetched data
//       setStats(data[0]); // Assuming the API returns an array with one object
//     };

//     fetchStats();
//   }
// }, [jobId]);

//  // WebSocket connection for real-time updates
//  useEffect(() => {
//   const ws = new WebSocket('ws://localhost:8080'); // Connect to WebSocket server

//   ws.onopen = () => {
//     console.log('WebSocket connection established');
//     ws.send(JSON.stringify({ test: 'Hello Server' }));
//   };

//   ws.onmessage = (event) => {
//     console.log('Raw WebSocket message:', event.data); // Log the raw message

//     // Handle Buffer data
//     if (event.data instanceof Blob) {
//       // If the data is a Blob (binary data), convert it to text
//       const reader = new FileReader();
//       reader.onload = () => {
//         const messageString = reader.result; // Get the message as a string
//         console.log('Decoded message:', messageString);

//         try {
//           const data = JSON.parse(messageString); // Parse the message as JSON
//           console.log('Parsed WebSocket message:', data);

//           if (data.fileId === jobId) {
//             if (data.progress !== undefined) {
//               setProgress(data.progress); // Update progress
//             }
//             if (data.status === 'completed') {
//               setStatus('Completed'); // Update status
//             }
//           }
//         } catch (error) {
//           console.log('Error parsing WebSocket message:', error);
//         }
//       };
//       reader.readAsText(event.data); // Read the Blob as text
//     } else if (typeof event.data === 'string') {
//       // If the data is already a string, parse it directly
//       try {
//         const data = JSON.parse(event.data); // Parse the message as JSON
//         console.log('Parsed WebSocket message:', data);

//         if (data.jobId === jobId) {
//           if (data.progress !== undefined) {
//             setProgress(data.progress); // Update progress
//           }
//           if (data.status === 'completed') {
//             setStatus('Completed'); // Update status
//           }
//         }
//       } catch (error) {
//         console.log('Error parsing WebSocket message:', error);
//       }
//     } else {
//       console.log('Unsupported WebSocket message format:', event.data);
//     }
//   };

//     // if (data.jobId === jobId) {
//     //   console.log('Matching Job ID, updating progress'); // Debugging line
//     //   if (data.progress !== undefined) {
//     //     setProgress(data.progress); // Update progress
//     //   }
//     //   if (data.status === 'completed') {
//     //     setStatus('Completed'); // Update status
//     //   }
//     // }
  
//   ws.onerror = (err) => {
//     console.log('WebSocket error:', err);
//   };

//   ws.onclose = () => {
//     console.log('WebSocket connection closed');
//   };

//   return () => {
//     ws.close(); // Clean up WebSocket connection
//   };
// }, [jobId]);


//  // Chart data for Keyword Counts
//  const keywordCountsData = stats ? {
//   labels: Object.keys(stats.keywordCounts),
//   datasets: [
//     {
//       label: 'Keyword Counts',
//       data: Object.values(stats.keywordCounts),
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for the bars
//     },
//   ],
// } : {};

// // Chart data for IP Counts
// const ipCountsData = stats ? {
//   labels: Object.keys(stats.ipCounts),
//   datasets: [
//     {
//       label: 'IP Counts',
//       data: Object.values(stats.ipCounts),
//       backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
//     },
//   ],
// } : {};

// return (
//   <div style={{ padding: '20px' }}>
//     <h1>Log File Upload</h1>
//     <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//     <button onClick={handleUpload} disabled={loading}>
//       {loading ? 'Uploading...' : 'Upload'}
//     </button>


//     {stats && (
//       <div className="card">
//         <h2 style={{ color: 'black' }}>Processed Stats</h2>
        
//         {jobId && <p style={{ color: 'black' }}>Job ID: {jobId}</p>}

//         {/* Display progress and status */}
//         {progress > 0 && <p style={{ color: 'black' }}>Progress: {progress}%</p>}
//         {status && <p style={{ color: 'black' }}>Status: {status}</p>}

//         {/* Display Charts for Keyword and IP Counts */}
//         <div className="stats-container">
//           <h3 style={{ color: 'black' }}>Keyword Counts</h3>
//           <div style={{ width: '80%', height: '300px' }}>
//             <Chart type="bar" data={keywordCountsData} />
//           </div>
//         </div>

//         <div className="stats-container">
//           <h3 style={{ color: 'black' }}>IP Counts</h3>
//           <div style={{ width: '80%', height: '300px' }}>
//             <Chart type="bar" data={ipCountsData} />
//           </div>
//         </div>

//         {/* Displaying Error Count and other stats in a Table */}
//          {/* Displaying Error Count and other stats in a Table */}
//          <table className="table-stats" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//             <thead>
//               <tr>
//                 <th style={{ padding: '10px', border: '1px solid black', textAlign: 'left', color: 'black' }}>Metric</th>
//                 <th style={{ padding: '10px', border: '1px solid black', textAlign: 'left', color: 'black' }}>Value</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>Error Count</td>
//                 <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>{stats.errorCount}</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '10px', border: '1px solid black',  color: 'black' }}>Keyword Counts</td>
//                 <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>
//                   <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, color: 'black' }}>
//                     {JSON.stringify(stats.keywordCounts, null, 2)}
//                   </pre>
//                 </td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>IP Counts</td>
//                 <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>
//                   <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, color: 'black' }}>
//                     {JSON.stringify(stats.ipCounts, null, 2)}
//                   </pre>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


'use client'; // Mark this as a Client Component

import { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2'; // Import Chart.js
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null); // User state for authenticated user

  const router = useRouter(); // Initialize useRouter for redirection

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

   // Fetch stats after completion
   useEffect(() => {
    const fetchStats = async () => {
      if (jobId && status === 'Completed' && !stats) { // Only fetch if stats are not already set
        console.log('Fetching stats for jobId:', jobId);
        try {
          const response = await fetch(`http://localhost:3000/api/stats/${jobId}`);
          const data = await response.json();
          console.log('Fetched stats:', data);
          setStats(data[0]);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    };
  
    fetchStats();
  }, [jobId, status, stats]); // Add stats as a dependency

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!jobId) return; // Do not initialize WebSocket until jobId is set

    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = async (event) => {
      console.log("Raw WebSocket message:", event.data);
    
      if (event.data instanceof Blob) {
        const textData = await event.data.text();
        console.log("Decoded WebSocket message:", textData);
    
        try {
          const data = JSON.parse(textData);
          console.log("Parsed WebSocket message:", data);
    
          if (data.fileId === jobId) {
            if (data.progress !== undefined) {
              console.log("Updating Progress:", data.progress);
              setProgress(data.progress);
            }
            if (data.status === "completed") {
              console.log("Updating Status: Completed");
              setStatus("Completed");  // ✅ Ensure status updates
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      } else if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          console.log("Parsed WebSocket message:", data);
    
          if (data.jobId === jobId) {
            if (data.progress !== undefined) {
              console.log("Updating Progress:", data.progress);
              setProgress(data.progress);
            }
            if (data.status === "completed") {
              console.log("Updating Status: Completed");
              setStatus("Completed");  // ✅ Ensure status updates
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      } else {
        console.log("Unsupported WebSocket message format:", event.data);
      }
    };
    
    

    ws.onerror = (err) => console.log('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket connection closed');

    return () => ws.close();
  }, [jobId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

   // Log out function
   const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear user-related state
      setUser(null);
      setStats(null);
      setJobId(null);
      setProgress(0);
      setStatus('');

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file upload
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('logFile', file);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/upload-logs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const { jobId } = await response.json();
      setJobId(jobId);
    } catch (error) {
      console.log('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };


  // Chart data
  const keywordCountsData = stats ? {
    labels: Object.keys(stats.keywordCounts),
    datasets: [{
      label: 'Keyword Counts',
      data: Object.values(stats.keywordCounts),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  } : {};

  const ipCountsData = stats ? {
    labels: Object.keys(stats.ipCounts),
    datasets: [{
      label: 'IP Counts',
      data: Object.values(stats.ipCounts),
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
    }],
  } : {};

  return (
    
    <div style={{ padding: '20px' }}>
       {/* Log Out Button */}
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF5733',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      </div>

      <h1>Log File Upload</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {jobId && (
        <div className="card">
          <h2 style={{ color: 'black' }}>Processed Stats</h2>
          <p style={{ color: 'black' }}>Job ID: {jobId}</p>
          <p style={{ color: 'black' }}>Progress: {progress}%</p>
          <p style={{ color: 'black' }}>Status: {status}</p>
        </div>
      )}

      {status === 'Completed' && stats && (
        <div className="card">
          <h3 style={{ color: 'black' }}>Keyword Counts</h3>
          <div style={{ width: '80%', height: '300px' }}>
            <Chart type="bar" data={keywordCountsData} />
          </div>

          <h3 style={{ color: 'black' }}>IP Counts</h3>
          <div style={{ width: '80%', height: '300px' }}>
            <Chart type="bar" data={ipCountsData} />
          </div>
         {/* Displaying Error Count and other stats in a Table */}
         <table className="table-stats" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid black', textAlign: 'left', color: 'black' }}>Metric</th>
                <th style={{ padding: '10px', border: '1px solid black', textAlign: 'left', color: 'black' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>Error Count</td>
                <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>{stats.errorCount}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid black',  color: 'black' }}>Keyword Counts</td>
                <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, color: 'black' }}>
                    {JSON.stringify(stats.keywordCounts, null, 2)}
                  </pre>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>IP Counts</td>
                <td style={{ padding: '10px', border: '1px solid black', color: 'black' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, color: 'black' }}>
                    {JSON.stringify(stats.ipCounts, null, 2)}
                  </pre>
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      )}
    </div>
  );
}
