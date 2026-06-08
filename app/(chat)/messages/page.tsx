// import ConversationList from "./MessageComponents/ConversationList";

// export default function MessagesPage() {
//     return (
//         <div className="max-w-7xl mx-auto p-6">
//             <div className="border rounded-xl h-[80vh] overflow-hidden">
//                 <ConversationList />
//             </div>
//         </div>
//     );
// }

import ConversationList from "./MessageComponents/ConversationList";

export default function MessagesPage() {
    return (
        <div className="grid grid-cols-12 h-full">

            {/* LEFT SIDE - USERS */}
            <div className="col-span-4 border-r">
                <ConversationList />
            </div>

            {/* RIGHT SIDE - EMPTY STATE */}
            <div className="col-span-8 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
            </div>
        </div>
    );
}