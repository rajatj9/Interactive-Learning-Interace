/**
 * gears.d3.js
 * http://brm.io/gears-d3-js/
 * License: MIT
 */

export const gearPath = function (options) {
  var addendum = options.addendum,
      dedendum = options.dedendum,
      thickness = options.thickness,
      profileSlope = options.profileSlope,
      holeRadius = options.holeRadius,
      teeth = options.teeth,
      radius = options.radius - addendum,
      rootRadius = radius - dedendum,
      outsideRadius = radius + addendum,
      circularPitch = (1 - thickness) * 2 * Math.PI / teeth,
      pitchAngle = thickness * 2 * Math.PI / teeth,
      slopeAngle = pitchAngle * profileSlope * 0.5,
      addendumAngle = pitchAngle * (1 - profileSlope),
      theta = (addendumAngle * 0.5 + slopeAngle),
      path = ['M', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta)];

  for (var i = 0; i < teeth; i++) {
    theta += circularPitch;

    path.push(
        'A', rootRadius, ',', rootRadius, ' 0 0,1 ', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta),
        'L', radius * Math.cos(theta), ',', radius * Math.sin(theta)
    );

    theta += slopeAngle;
    path.push('L', outsideRadius * Math.cos(theta), ',', outsideRadius * Math.sin(theta));
    theta += addendumAngle;
    path.push('A', outsideRadius, ',', outsideRadius, ' 0 0,1 ', outsideRadius * Math.cos(theta), ',', outsideRadius * Math.sin(theta));
    theta += slopeAngle;

    path.push(
        'L', radius * Math.cos(theta), ',', radius * Math.sin(theta),
        'L', rootRadius * Math.cos(theta), ',', rootRadius * Math.sin(theta)
    );
  }

  path.push('M0,', -holeRadius, 'A', holeRadius, ',', holeRadius, ' 0 0,0 0,', holeRadius, 'A', holeRadius, ',', holeRadius, ' 0 0,0 0,', -holeRadius, 'Z');

  return path.join('');
}