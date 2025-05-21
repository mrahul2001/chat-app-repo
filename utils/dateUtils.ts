// export const formatMessageDate = (dateString: string): string => {
//   if (!dateString) return '';
  
//   const date = new Date(dateString);
//   const today = new Date();
  
//   if (date.getDate() === today.getDate() && 
//       date.getMonth() === today.getMonth() && 
//       date.getFullYear() === today.getFullYear()) {
//     return 'Today';
//   }
  
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   if (date.getDate() === yesterday.getDate() && 
//       date.getMonth() === yesterday.getMonth() && 
//       date.getFullYear() === yesterday.getFullYear()) {
//     return 'Yesterday';
//   }
  
//   return date.toLocaleDateString();
// };

// export const formatTime = (dateString: string): string => {
//   if (!dateString) return '';
  
//   return new Date(dateString).toLocaleTimeString([], { 
//     hour: '2-digit', 
//     minute: '2-digit' 
//   });
// }; 