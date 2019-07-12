pragma solidity ^0.4.24;

import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TimeMedianDataFeed is DataFeedOracleBase {
  using SafeMath for uint;

  event MedianizedByTimeframe(bytes32 median, uint startDate, uint endDate);
  event MedianizedByOrderedDates(bytes32 median, uint[] dates);

  mapping(uint => bool) dateAlreadyAccountedFor; // transitory data structure useful only during function call medianizeByDates

  function medianizeByTimeframe(uint startDate, uint endDate)
  public
  returns (bytes32 medianValue) {
    require(startDate < endDate, 'startDate must be less than endDate');
    uint endIndex;
    uint startIndex;

    // find end date within dates array
    for (uint i = dates.length - 1; i > 0 && endIndex == 0; i--) {
      if (dates[i] <= endDate) {
        endIndex = i; // ONLY dates before the end date
      }
    }

    // require endIndex is more than 0
    require(endIndex > 0, 'dates outside of range of datafeed results');
    require(dates[endIndex] >= startDate, 'dates outside of range of datafeed results');

    // find start date within dates array
    for (uint j = endIndex; j >= 0 && startIndex == 0; j--) {
      if (dates[j] < startDate) {
        startIndex = j + 1; // no dates before the startDate
      }
    }

    uint[] memory selectedDates = _createPartialArray(startIndex, endIndex);
    uint[] memory partitionedDates = partitionDates(selectedDates);
    medianValue = _medianizeByDates(partitionedDates);
    emit MedianizedByTimeframe(medianValue, startDate, endDate);
  }

  function medianizeByDates(uint[] orderedDates)
  public
  returns (bytes32 medianValue) {
    for (uint i = 0; i < orderedDates.length; i++) {
      uint date = orderedDates[i];
      require(isResultSetFor(date), "Date not set.");
      require(!dateAlreadyAccountedFor[date], 'Date cannot be a duplicate');
      dateAlreadyAccountedFor[orderedDates[i]] = true;
      if (i != orderedDates.length - 1) {
        require(uint(results[date]) <= uint(results[orderedDates[i+1]]), "The dates are not sorted by result.");
      }
    }

    // reset dataFeedAlreadyRecorded
    for(uint j=0; j < orderedDates.length; j++) {
      dateAlreadyAccountedFor[orderedDates[j]] = false;
    }

    medianValue = _medianizeByDates(orderedDates);
    emit MedianizedByOrderedDates(medianValue, orderedDates);
  }

  // Private Functions

  function _medianizeByDates(uint[] orderedDates)
  private
  returns (bytes32 medianValue) {
    uint middleIndex = orderedDates.length / 2;
    uint middleDate  = orderedDates[middleIndex];
    medianValue = results[middleDate];
  }

  function partitionDates(uint[] selectedDates)
  private
  returns (uint[]) {
    // To minimize complexity, return the higher of the two middle checkpoints in even-sized arrays instead of the average.
    uint k = selectedDates.length.div(2);
    uint left = 0;
    uint right = selectedDates.length.sub(1);

    while (left < right) {
        uint pivotIndex = left.add(right).div(2);
        uint pivotValue = selectedDates[pivotIndex];

        (selectedDates[pivotIndex], selectedDates[right]) = (selectedDates[right], selectedDates[pivotIndex]);
        uint storeIndex = left;
        for (uint i = left; i < right; i++) {
            if (_isLessThan(selectedDates[i], pivotValue)) {
                (selectedDates[storeIndex], selectedDates[i]) = (selectedDates[i], selectedDates[storeIndex]);
                storeIndex++;
            }
        }

        (selectedDates[storeIndex], selectedDates[right]) = (selectedDates[right], selectedDates[storeIndex]);
        if (storeIndex < k) {
            left = storeIndex.add(1);
        } else {
            right = storeIndex;
        }
    }

    return selectedDates;
  }

  function resultByIndex(uint256 index)
  private
  view
  returns (bytes32) {
    require(doesIndexExistFor(index), "The index is not been set yet.");
    return results[dates[index]];
  }

  function _createPartialArray(uint start, uint end)
  private
  returns (uint[]) {
    uint length = end - start + 1;
    uint[] memory arr = new uint[](length);
    uint index = 0;
    for (uint i = start; i <= end; i++) {
        arr[index] = dates[i];
        index++;
    }
    return arr;
  }

  function _isLessThan(uint date1, uint date2)
  private
  returns (bool) {
    return uint(results[date1]) < uint(results[date2]);
  }
}
