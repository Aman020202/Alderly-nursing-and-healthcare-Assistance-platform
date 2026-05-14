import { CheckCircle, Clock, PlayCircle, Send } from 'lucide-react';

const steps = [
  { key: 'Pending', label: 'Requested', icon: Send },
  { key: 'Accepted', label: 'Accepted', icon: CheckCircle },
  { key: 'In Progress', label: 'In Progress', icon: PlayCircle },
  { key: 'Completed', label: 'Completed', icon: CheckCircle },
];

const statusOrder = ['Pending', 'Accepted', 'In Progress', 'Completed'];

const StatusTimeline = ({ currentStatus }) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isTerminal = ['Rejected', 'Cancelled'].includes(currentStatus);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Service Progress</h2>

      {isTerminal ? (
        <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
          <Clock className="h-6 w-6 text-red-500 mr-3" />
          <span className="text-red-800 font-bold text-lg">Booking {currentStatus}</span>
        </div>
      ) : (
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full"></div>
          {/* Active Progress */}
          <div
            className="absolute top-5 left-5 h-1 bg-blue-600 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 40px)' }}
          ></div>

          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex flex-col items-center z-10">
                  <div
                    className={`
                      h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                      ${isActive
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                      }
                      ${isCurrent ? 'ring-4 ring-blue-200 animate-pulse' : ''}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`mt-3 text-xs font-semibold text-center ${
                      isActive ? 'text-blue-700' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTimeline;
