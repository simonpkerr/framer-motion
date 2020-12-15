import { TooltipProvider, TooltipMarker, Tooltip } from './Tooltip';

const App = () => (
  <TooltipProvider>
    <h3>Tooltip</h3>
    <p style={{ textAlign: 'right' }}>
      Here's a tooltip to the right <TooltipMarker id='tt4' />
    </p>
    <Tooltip target='tt4' role='tooltip'>
      The tooltip is for a marker, contains a load of other stuff, but not too
      much, else that would be not very good, but just enough to be satisfying.
    </Tooltip>
    <p>
      Tool tips can be used for information <TooltipMarker id='tt1' />
    </p>
    <Tooltip target='tt1' role='tooltip'>
      The tooltip contains a bit more information to help you understand what
      something means
    </Tooltip>
    <p style={{ display: 'block', marginTop: '4rem' }}>
      <TooltipMarker id='tt2' /> Here's another tooltip
    </p>
    <Tooltip target='tt2' role='tooltip'>
      The tooltip is for the second marker, contains a load of other stuff, but
      not too much, else that would be not very good, but just enough to be
      satisfying.
    </Tooltip>
    <p style={{ textAlign: 'right' }}>
      Here's another tooltip to the right <TooltipMarker id='tt3' />
    </p>
    <Tooltip target='tt3' role='tooltip'>
      The tooltip is for the third marker, contains a load of other stuff, but
      not too much, else that would be not very good, but just enough to be
      satisfying.
    </Tooltip>
  </TooltipProvider>
);

export default App;
