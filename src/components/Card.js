import React, { Component } from 'react';
import Bus from './Icons/Bus';


class Card extends Component {

  clickCard = () => {
    this.props.setCurrentStop(this.props.stop);
  }

  render() {

    //Active card
    let classesCard = "card flex m-right-tablet-desktop m-bottom-tablet-desktop";
    let classesBusIcon = "bus-card"
    let classesNumberLine = "number-bus number-card-font"
    if (this.props.selected) {
      classesCard += " active-card";
      classesBusIcon += " active-bus";
      classesNumberLine += " active-number-line";
    }

    //Stops lines
    const stopsBusLines = this.props.stop.line;
    let numberLine = "";
    if(stopsBusLines.length === undefined) {
      numberLine = <span className={classesNumberLine}>{stopsBusLines.line}</span>
    } else {
      numberLine = stopsBusLines.map(function(line, index) {
      return <span key={index} className={classesNumberLine}>{line.line}</span>
        })
    }

    //Section results
    const futureColumnClass = stopsBusLines.length >= 4 ? 'flex classColumn' : 'flex';

    return(
      <div className={classesCard}  onClick={this.clickCard}>
        <div className={futureColumnClass} id="columnMobile">
          <div className="flex box-numbers">
            {numberLine}
          </div>
          <div className="box-data-card">
            <h4 className="m-none data-title">{this.props.stop.name}</h4>
            <p className="data-medium">{this.props.stop.postalAddress}</p>
          </div>
        </div>
        <div className="flex box-icon-card">
          <Bus className={classesBusIcon} />
          <p className="m-none">Parada: {this.props.stop.stopId} </p>
        </div>
      </div>
    )
  }
}

export default Card;
